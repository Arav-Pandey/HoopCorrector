import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Display from "./Display";
import {
  calculateAngle,
  calculateDistance,
  getSimilarity,
  scoreElbowAngle,
  scoreElbowFlare,
  scoreBendAngle,
  getBendFeedback,
  checkKeypointVisibility,
  emptyMeasurements,
  averageTopFrames,
  formatMeasurement,
  getFlareFeedbackFromValues,
  getAnkleFeedback,
  getKneeDistanceFeedback,
  averageLowestKneeAngles,
} from "./calculations";
import type { Measurements, TopFrame } from "./calculations";
// import StephShot from "../assets/StephShot(3).mp4";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string; // recorded video URL
  contextList: string[];
  setContextList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Form({ setActive, videoURL, setContextList }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Need canvas for the AI model to understand the pixels. Raw video data doesn't give pixels, canvas does
  const [ankleFeedback, setAnkleFeedback] = useState("");
  const [kneeFeedback, setKneeFeedback] = useState("");
  const [flareFeedback, setFlareFeedback] = useState("");
  const [bendFeedback, setBendFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const detectRef = useRef<() => void>(() => {});
  const [flareScore, setFlareScore] = useState<number | null>(null);
  const [angleScore, setAngleScore] = useState<number | null>(null);
  const [bendScore, setBendScore] = useState<number | null>(null);
  const topFramesRef = useRef<TopFrame[]>([]);
  const latestMeasurementsRef = useRef<Measurements>(emptyMeasurements());
  const elbowScore =
    flareScore !== null && angleScore !== null
      ? flareScore * 0.6 + angleScore * 0.4
      : null;
  const similarityRef = useRef<number | null>(null);
  const lowestKneeAngleRef = useRef<number>(Infinity);
  const [dominantHand, setDominantHand] = useState<"left" | "right" | null>(
    null,
  );
  const minVis = 0.6;
  const curryBaseline = {
    flare: 0.02,
    elbowAngle: 1.74,
  };
  const topFrameCount = 5;
  const kneeAngleAverageCount = 5;
  const kneeFramesRef = useRef<number[]>([]);

  useEffect(() => {
    if (dominantHand === null) return;

    let poseLandmarker: PoseLandmarker;
    let animationFrameId: number;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm",
      );

      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        // Loads engine
        baseOptions: {
          // Downloads the AI files and which model to run
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
        },
        runningMode: "VIDEO", // What type of input is being send to the model. VIDEO means continuous frames from a video
        numPoses: 1, // Only detect one person
      });

      setupVideo();
    }

    function setupVideo() {
      if (!videoRef.current) return;

      videoRef.current.src = videoURL;
      // videoRef.current.src = StephShot;
      videoRef.current.crossOrigin = "anonymous";
      // Loads the video with no credentials or cookies and allows us access even if the browser permits it

      videoRef.current.onloadedmetadata = () => {
        const video = videoRef.current!;
        const canvas = canvasRef.current!;

        topFramesRef.current = [];
        latestMeasurementsRef.current = emptyMeasurements();
        lowestKneeAngleRef.current = Infinity;
        similarityRef.current = null;

        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        video.play();

        video.onplaying = () => {
          detect();
        };
      };
    }

    function detect() {
      if (!videoRef.current || !canvasRef.current || !poseLandmarker) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d"); // Think of canvas as the sheet of paper and the ctx(context) as the pen or pencil. Without ctx canvas is useless.
      if (!ctx) return;

      if (video.paused || video.ended) {
        if (video.ended) {
          cancelAnimationFrame(animationFrameId);

          const averagedLowestKnee = averageLowestKneeAngles(
            kneeFramesRef.current,
            kneeAngleAverageCount,
          );

          const best = averageTopFrames(
            topFramesRef.current,
            averagedLowestKnee,
            topFrameCount,
          );

          if (!best) {
            similarityRef.current = null;
            return;
          }

          if (best.flare !== 0) {
            setFlareScore(scoreElbowFlare(best.flare));
          }
          if (best.elbowAngle !== 0) {
            setAngleScore(scoreElbowAngle(best.elbowAngle));
          }
          if (Number.isFinite(averagedLowestKnee)) {
            setBendScore(scoreBendAngle(averagedLowestKnee));
          }
          console.log(
            "Flare: ",
            best.flare,
            "Angle: ",
            best.elbowAngle,
            "WristY: ",
            best.wristY,
            "KneeAngle: ",
            best.kneeAngle,
          );

          if (best.flare !== 0 && best.elbowAngle !== 0 && best.wristY !== 0) {
            similarityRef.current = getSimilarity(best, curryBaseline);
            console.log("Curry Similarity:", similarityRef.current);
          } else {
            similarityRef.current = null;
          }

          const measurements = latestMeasurementsRef.current;
          setContextList((previousContext) => [
            ...previousContext,
            `Shooting elbow is ${formatMeasurement(best.flare)} pixels off of in line with the shooting shoulder.`,
            `Elbow angle is ${formatMeasurement(best.elbowAngle)} degrees.`,
            `Ankle distance is ${formatMeasurement(measurements.ankleDistance)} pixels.`,
            `Knee distance is ${formatMeasurement(measurements.kneeDistance)} pixels.`,
            `Shoulder distance is ${formatMeasurement(measurements.shoulderDistance)} pixels.`,
          ]);

          return;
        }

        if (video.paused) {
          animationFrameId = requestAnimationFrame(detect);
          return;
        }
      }

      const results = poseLandmarker.detectForVideo(video, performance.now()); // Runs AI model on current video frame(not whole video)

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas

      if (results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];

        // Draw landmarks
        landmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(
            landmark.x * video.clientWidth,
            landmark.y * video.clientHeight,
            5,
            0,
            2 * Math.PI,
          );
          ctx.fillStyle = "lime";
          ctx.fill();
        });

        // === Getting Points ===
        const shoulder =
          dominantHand === "right" ? landmarks[12] : landmarks[11];
        const rightShoulder = landmarks[12];
        const leftShoulder = landmarks[11];
        const elbow = dominantHand === "right" ? landmarks[14] : landmarks[13];
        const wrist = dominantHand === "right" ? landmarks[16] : landmarks[15];
        const rightAnkle = landmarks[28];
        const leftAnkle = landmarks[27];
        const rightKnee = landmarks[26];
        const leftKnee = landmarks[25];
        const hip = dominantHand == "right" ? landmarks[24] : landmarks[23];
        const knee = dominantHand == "right" ? landmarks[26] : landmarks[25];
        const ankle = dominantHand == "right" ? landmarks[28] : landmarks[27];

        if (
          !shoulder ||
          !rightShoulder ||
          !leftShoulder ||
          !elbow ||
          !wrist ||
          !rightAnkle ||
          !leftAnkle ||
          !rightKnee ||
          !leftKnee ||
          !hip ||
          !knee ||
          !ankle
        ) {
          setErrorFeedback("⚠️ Unable to detect all keypoints.");
          animationFrameId = requestAnimationFrame(detect);
          return;
        }

        const measurements = emptyMeasurements();
        const keypointsVisible = checkKeypointVisibility(
          {
            rightShoulder,
            leftShoulder,
            elbow,
            wrist,
            rightAnkle,
            leftAnkle,
            rightKnee,
            leftKnee,
          },
          minVis,
        );
        const anklesVisible =
          leftAnkle.visibility > minVis && rightAnkle.visibility > minVis;
        const kneesVisible =
          leftKnee.visibility > minVis && rightKnee.visibility > minVis;
        const shouldersVisible =
          rightShoulder.visibility > minVis && leftShoulder.visibility > minVis;
        const shootingArmVisible =
          shoulder.visibility > minVis &&
          elbow.visibility > minVis &&
          wrist.visibility > minVis;
        const bendVisible =
          hip.visibility > minVis &&
          leftKnee.visibility > minVis &&
          leftAnkle.visibility > minVis;

        setErrorFeedback((prev) =>
          keypointsVisible ? prev : "⚠️ Some keypoints not visible enough.",
        );

        if (bendVisible) {
          const kneeAngle = calculateAngle(hip, knee, ankle);
          kneeFramesRef.current.push(kneeAngle);
          if (kneeAngle < lowestKneeAngleRef.current) {
            lowestKneeAngleRef.current = kneeAngle;
          }
        }

        if (anklesVisible) {
          measurements.ankleDistance = calculateDistance(rightAnkle, leftAnkle);
        }
        if (kneesVisible) {
          measurements.kneeDistance = calculateDistance(rightKnee, leftKnee);
        }
        if (shouldersVisible) {
          measurements.shoulderDistance = calculateDistance(
            rightShoulder,
            leftShoulder,
          );
        }

        if (shootingArmVisible) {
          measurements.elbowAngle = calculateAngle(shoulder, elbow, wrist);
          measurements.flareDistance = Math.abs(elbow.x - shoulder.x);

          topFramesRef.current.push({
            wristY: wrist.y,
            elbowAngle: measurements.elbowAngle,
            flare: measurements.flareDistance,
          });
        }

        latestMeasurementsRef.current = measurements;

        setFlareFeedback(
          getFlareFeedbackFromValues(
            measurements.flareDistance,
            measurements.elbowAngle,
          ),
        );
        setAnkleFeedback(
          getAnkleFeedback(
            measurements.ankleDistance,
            measurements.shoulderDistance,
          ),
        );
        setKneeFeedback(
          getKneeDistanceFeedback(
            measurements.kneeDistance,
            measurements.shoulderDistance,
          ),
        );
        if (Number.isFinite(lowestKneeAngleRef.current)) {
          setBendFeedback(getBendFeedback(lowestKneeAngleRef.current));
        } else {
          setBendFeedback("⚠️ Unable to detect knee bend.");
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    }

    init();
    detectRef.current = detect;

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoURL, dominantHand, setContextList]);

  const rewatchFeedback = () => {
    if (!videoRef.current) return;

    setAnkleFeedback("All Good!");
    setKneeFeedback("All Good!");
    setFlareFeedback("All Good!");
    setErrorFeedback("");
    setBendFeedback(null);
    setFlareScore(null);
    setAngleScore(null);
    setBendScore(null);
    similarityRef.current = null;
    topFramesRef.current = [];
    latestMeasurementsRef.current = emptyMeasurements();
    lowestKneeAngleRef.current = Infinity;

    videoRef.current.currentTime = 0; // go back to start
    videoRef.current.play(); // start playing again

    detectRef.current(); // restart pose detection
  };

  return (
    <Display
      videoRef={videoRef}
      canvasRef={canvasRef}
      rewatchFeedback={rewatchFeedback}
      ankleFeedback={ankleFeedback}
      kneeFeedback={kneeFeedback}
      flareFeedback={flareFeedback}
      bendFeedeback={bendFeedback}
      elbowScore={elbowScore}
      errorFeedback={errorFeedback}
      setActive={setActive}
      flareScore={flareScore}
      angleScore={angleScore}
      bendScore={bendScore}
      similarity={similarityRef}
      setDominantHand={setDominantHand}
    />
  );
}
