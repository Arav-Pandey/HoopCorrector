import { useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import Display from "./Display";
import {
  calculateAngle,
  calculateDistance,
  calculateKneeAngle,
  getSimilarity,
  scoreElbowAngle,
  scoreElbowFlare,
  scoreBendAngle,
  getFlareFeedback,
  getAnkleFeedback,
  getKneeDistanceFeedback,
  getBendFeedback,
  checkKeypointVisibility,
} from "./calculations";
import StephShot from "../assets/StephShot(3).mp4";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string; // recorded video URL
  contextList: string[];
  setContextList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Form({
  setActive,
  videoURL,
  contextList,
  setContextList,
}: Props) {
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
  const [elbowScore, setElbowScore] = useState<number | null>(null);
  const [bendScore, setBendScore] = useState<number | null>(null);
  const topFramesRef = useRef<any[]>([]);
  const curryBaseline = {
    flare: 0.02,
    elbowAngle: 1.74,
  };
  const similarityRef = useRef<number | null>(null);
  const ankleDistanceRef = useRef<number | null>(null);
  const kneeDistanceRef = useRef<number | null>(null);
  const shoulderDistanceRef = useRef<number | null>(null);
  const lowestKneeAngleRef = useRef<number>(Infinity);
  const elbowAngleRef = useRef<number | null>(null);
  const [dominantHand, setDominantHand] = useState<"left" | "right" | null>(
    null,
  );
  const rightShoulderRef = useRef<NormalizedLandmark | null>(null);
  const leftShoulderRef = useRef<NormalizedLandmark | null>(null);
  const rightElbowRef = useRef<NormalizedLandmark | null>(null);
  const leftElbowRef = useRef<NormalizedLandmark | null>(null);

  useEffect(() => {
    if (angleScore === null || flareScore === null) return;

    setElbowScore(
      flareScore !== null && angleScore !== null
        ? flareScore * 0.6 + angleScore * 0.4
        : null,
    );
  }, [angleScore, flareScore]);

  useEffect(() => {
    if (dominantHand === null) {
      console.log("Dominant hand not selected yet.", dominantHand);
      return;
    }
    let poseLandmarker: PoseLandmarker;
    let animationFrameId: number;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      ); // Downloads the wasm files that run the AI model in the browser. Now vision holds the backend needed to run the pose detection

      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        // Loads engine
        baseOptions: {
          // Downloads the AI files and which model to run
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
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

          const sorted = topFramesRef.current.sort(
            (a, b) => a.wristY - b.wristY,
          );

          // take top 5 highest wrist frames
          const top5 = sorted.slice(0, 5);

          // average them
          const avg = top5.reduce(
            (acc, f) => ({
              wristY: acc.wristY + f.wristY,
              elbowAngle: acc.elbowAngle + f.elbowAngle,
              flare: acc.flare + f.flare,
            }),
            { wristY: 0, elbowAngle: 0, flare: 0 },
          );

          const best = {
            wristY: avg.wristY / 5,
            elbowAngle: avg.elbowAngle / 5,
            flare: avg.flare / 5,
            kneeAngle: lowestKneeAngleRef.current,
          };
          if (best.flare !== 0) {
            setFlareScore(scoreElbowFlare(best.flare));
          }
          if (best.elbowAngle !== 0) {
            setAngleScore(scoreElbowAngle(best.elbowAngle));
          }
          if (lowestKneeAngleRef.current !== null) {
            setBendScore(scoreBendAngle(lowestKneeAngleRef.current));
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
        const leftHip = landmarks[23];

        rightShoulderRef.current = rightShoulder;
        leftShoulderRef.current = leftShoulder;
        rightElbowRef.current = elbow;
        leftElbowRef.current = landmarks[13];

        // Checking if points are not at all detected
        if (
          !rightShoulder ||
          !leftShoulder ||
          !elbow ||
          !wrist ||
          !rightAnkle ||
          !leftAnkle ||
          !rightKnee ||
          !leftKnee
        ) {
          setErrorFeedback("⚠️ Unable to detect all keypoints.");
        }

        // Checking if points are barely detected
        if (rightAnkle.visibility < 0.1 || leftAnkle.visibility < 0.1) {
          setAnkleFeedback("⚠️ Ankles not visible enough.");
        }
        if (rightKnee.visibility < 0.1 || leftKnee.visibility < 0.1) {
          setKneeFeedback("⚠️ Knees not visible enough.");
        }
        if (
          leftHip.visibility < 0.1 ||
          leftKnee.visibility < 0.1 ||
          leftAnkle.visibility < 0.1
        ) {
          setBendFeedback("⚠️ Unable to detect knee bend.");
        }

        setErrorFeedback(
          checkKeypointVisibility(
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
            1,
          ),
        );

        if (leftAnkle.visibility > 0.1 && rightAnkle.visibility > 0.1) {
          ankleDistanceRef.current = calculateDistance(rightAnkle, leftAnkle);
        }
        if (leftKnee.visibility > 0.1 && rightKnee.visibility > 0.1) {
          kneeDistanceRef.current = calculateDistance(rightKnee, leftKnee);
        }
        if (rightShoulder.visibility > 0.1 && leftShoulder.visibility > 0.1) {
          shoulderDistanceRef.current = calculateDistance(
            rightShoulder,
            leftShoulder,
          );
        }
        if (
          leftHip.visibility > 0.1 &&
          leftKnee.visibility > 0.1 &&
          leftAnkle.visibility > 0.1
        ) {
          let kneeAngle = calculateKneeAngle(leftHip, leftKnee, leftAnkle);
          if (kneeAngle < lowestKneeAngleRef.current) {
            lowestKneeAngleRef.current = kneeAngle;
          }
        }
        if (
          rightShoulder.visibility > 0.1 &&
          elbow.visibility > 0.1 &&
          wrist.visibility > 0.1
        ) {
          elbowAngleRef.current = calculateAngle(rightShoulder, elbow, wrist);
        }

        // Elbow flare detection
        const flareDistance = Math.abs(elbow.x - shoulder.x);
        setContextList([
          ...contextList,
          `Shooting elbow is ${flareDistance} pixels off of in line with the shooting shoulder.`,
          `Ankle distance is ${ankleDistanceRef} pixels.`,
          `Knee distance is ${kneeDistanceRef} pixels.`,
          `Shoulder distance is ${shoulderDistanceRef} pixels.`,
        ]);

        topFramesRef.current.push({
          wristY: wrist.y,
          elbowAngle: elbowAngleRef.current,
          flare: flareDistance,
        });

        // Checking calculations and giving feedback. See in calculations.tsx how the feedback is determined
        setFlareFeedback(getFlareFeedback(flareDistance, elbowAngleRef));

        setAnkleFeedback(
          getAnkleFeedback(ankleDistanceRef, shoulderDistanceRef),
        );

        setKneeFeedback(
          getKneeDistanceFeedback(kneeDistanceRef, shoulderDistanceRef),
        );
        if (lowestKneeAngleRef.current !== null) {
          setBendFeedback(getBendFeedback(lowestKneeAngleRef.current));
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    }

    init();
    detectRef.current = detect;

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoURL, dominantHand]);

  const rewatchFeedback = () => {
    if (!videoRef.current) return;

    setAnkleFeedback("All Good!");
    setKneeFeedback("All Good!");
    setFlareFeedback("All Good!");
    setErrorFeedback("");

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
      rightShoulderRef={rightShoulderRef}
      leftShoulderRef={leftShoulderRef}
      rightElbowRef={rightElbowRef}
      leftElbowRef={leftElbowRef}
    />
  );
}
