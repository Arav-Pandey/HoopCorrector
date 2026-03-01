import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Display from "./Display";
import {
  calculateAngle,
  calculateDistance,
  calculateKneeAngle,
  getSimilarity,
  scoreElbowAngle,
  scoreElbowFlare,
  getKneeFeedback,
  scoreBendAngle,
} from "./calculations";

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
  const [ankleFeedback, setAnkleFeedback] = useState("All Good!");
  const [kneeFeedback, setKneeFeedback] = useState("All Good!");
  const [flareFeedback, setFlareFeedback] = useState("All Good!");
  const [bendFeedback, setBendFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState("");
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
  const kneeAngleRef = useRef<number | null>(null);
  const elbowAngleRef = useRef<number | null>(null);
  const dominantHandRef = useRef<"left" | "right">("right");

  useEffect(() => {
    if (angleScore === null || flareScore === null) return;

    setElbowScore(
      flareScore !== null && angleScore !== null
        ? flareScore * 0.6 + angleScore * 0.4
        : null,
    );
  }, [angleScore, flareScore]);

  useEffect(() => {
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
          };
          if (best.flare !== 0) {
            setFlareScore(scoreElbowFlare(best.flare));
          }
          if (best.elbowAngle !== 0) {
            setAngleScore(scoreElbowAngle(best.elbowAngle));
          }
          if (kneeAngleRef.current !== null) {
            setBendScore(scoreBendAngle(kneeAngleRef.current));
          }
          console.log(
            "Flare: ",
            best.flare,
            "Angle: ",
            best.elbowAngle,
            "WristY: ",
            best.wristY,
          );

          similarityRef.current = getSimilarity(best, curryBaseline);
          console.log("Curry Similarity:", similarityRef.current);

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

        // === ARM ===
        const shoulder =
          dominantHandRef.current === "right" ? landmarks[12] : landmarks[11];
        const rightShoulder = landmarks[12];
        const leftShoulder = landmarks[11];
        const elbow =
          dominantHandRef.current === "right" ? landmarks[14] : landmarks[13];
        const wrist =
          dominantHandRef.current === "right" ? landmarks[16] : landmarks[15];
        const rightAnkle = landmarks[28];
        const leftAnkle = landmarks[27];
        const rightKnee = landmarks[26];
        const leftKnee = landmarks[25];
        const leftHip = landmarks[23];

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

        if (
          rightShoulder.visibility < 0.4 ||
          leftShoulder.visibility < 0.4 ||
          elbow.visibility < 0.4 ||
          wrist.visibility < 0.4 ||
          rightAnkle.visibility < 0.4 ||
          leftAnkle.visibility < 0.4 ||
          rightKnee.visibility < 0.4 ||
          leftKnee.visibility < 0.4
        ) {
          setErrorFeedback("⚠️ Keypoints not visible enough.");
        }

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
          kneeAngleRef.current = calculateKneeAngle(
            leftHip,
            leftKnee,
            leftAnkle,
          );
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

        // console.log("Calculating flare and angle");

        topFramesRef.current.push({
          wristY: wrist.y,
          elbowAngle: elbowAngleRef.current,
          flare: flareDistance,
        });

        if (flareDistance > 0.15) {
          setFlareFeedback("⚠️ Elbow is flaring too wide");
        } else if (elbowAngleRef.current && elbowAngleRef.current < 40) {
          setFlareFeedback("⚠️ Arm angle too tight");
        } else {
          setFlareFeedback("✅ Good elbow alignment");
        }

        if (
          ankleDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          ankleDistanceRef.current < shoulderDistanceRef.current - 1
        ) {
          setAnkleFeedback((prev) => prev + "⚠️ Feet are too close together");
        } else if (
          ankleDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          ankleDistanceRef.current > shoulderDistanceRef.current + 1
        ) {
          setAnkleFeedback((prev) => prev + "⚠️ Feet are too far apart");
        }
        if (
          kneeDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          kneeDistanceRef.current < shoulderDistanceRef.current - 6
        ) {
          setKneeFeedback((prev) => prev + "⚠️ Knees are too close together");
        } else if (
          kneeDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          kneeDistanceRef.current > shoulderDistanceRef.current + 6
        ) {
          setKneeFeedback((prev) => prev + "⚠️ Knees are too far apart");
        }
        if (kneeAngleRef.current !== null) {
          setBendFeedback(getKneeFeedback(kneeAngleRef.current));
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    }

    init();
    detectRef.current = detect;

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoURL]);

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
      dominantHandRef={dominantHandRef}
    />
  );
}
