import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import {
  calculateAngle,
  calculateDistance,
  calculateKneeAngle,
  scoreBendAngle,
} from "./calculations";
import DisplayLive from "./DisplayLive";

export default function FormLive() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ankleFeedback, setAnkleFeedback] = useState("All Good!");
  const [kneeFeedback, setKneeFeedback] = useState("All Good!");
  const [flareFeedback, setFlareFeedback] = useState("All Good!");
  const [bendFeedback, setBendFeedback] = useState("All Good!");
  const [errorFeedback, setErrorFeedback] = useState("");
  const ankleDistanceRef = useRef<number | null>(null);
  const kneeDistanceRef = useRef<number | null>(null);
  const shoulderDistanceRef = useRef<number | null>(null);
  const flareDistanceRef = useRef<number | null>(null);
  const elbowAngleRef = useRef<number | null>(null);
  const kneeAngleRef = useRef<number | null>(null);
  const dominantHandRef = useRef<"left" | "right">("right");

  const detectRef = useRef<() => void>(() => {});

  useEffect(() => {
    let poseLandmarker: PoseLandmarker;
    let animationFrameId: number;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );

      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      setupCamera();
    }

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          const video = videoRef.current!;
          const canvas = canvasRef.current!;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          video.play();
          detect();
        };
      } catch (err) {
        setErrorFeedback("⚠️ Unable to access camera.");
      }
    }

    function detect() {
      if (!videoRef.current || !canvasRef.current || !poseLandmarker) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const results = poseLandmarker.detectForVideo(video, performance.now());

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];

        // Draw landmarks
        landmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            5,
            0,
            2 * Math.PI,
          );
          ctx.fillStyle = "lime";
          ctx.fill();
        });

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
        const hip =
          dominantHandRef.current === "right" ? landmarks[24] : landmarks[23];
        const knee =
          dominantHandRef.current === "right" ? landmarks[26] : landmarks[25];
        const ankle =
          dominantHandRef.current === "right" ? landmarks[28] : landmarks[27];

        const shoulderVisible = shoulder.visibility > 0.1;
        const elbowVisible = elbow.visibility > 0.1;
        const wristVisible = wrist.visibility > 0.1;
        const shouldersVisible =
          rightShoulder.visibility > 0.1 && leftShoulder.visibility > 0.1;
        const anklesVisible =
          leftAnkle.visibility > 0.1 && rightAnkle.visibility > 0.1;
        const kneesVisible =
          leftKnee.visibility > 0.1 && rightKnee.visibility > 0.1;
        const hipVisible = hip.visibility > 0.1;

        const keypointsVisibleEnough =
          rightShoulder.visibility >= 0.4 &&
          leftShoulder.visibility >= 0.4 &&
          elbow.visibility >= 0.4 &&
          wrist.visibility >= 0.4 &&
          rightAnkle.visibility >= 0.4 &&
          leftAnkle.visibility >= 0.4 &&
          rightKnee.visibility >= 0.4 &&
          leftKnee.visibility >= 0.4 &&
          hip.visibility >= 0.4 &&
          knee.visibility >= 0.4 &&
          ankle.visibility >= 0.4;

        setErrorFeedback(
          keypointsVisibleEnough ? "" : "⚠️ Keypoints not visible enough.",
        );

        if (hipVisible && kneesVisible && anklesVisible) {
          const bendAngle = calculateKneeAngle(hip, knee, ankle);
          kneeAngleRef.current = bendAngle;
        } else {
          kneeAngleRef.current = null;
        }

        if (shouldersVisible) {
          shoulderDistanceRef.current = calculateDistance(
            rightShoulder,
            leftShoulder,
          );
        } else {
          shoulderDistanceRef.current = null;
        }

        if (elbowVisible && shoulderVisible && wristVisible) {
          elbowAngleRef.current = calculateAngle(shoulder, elbow, wrist);
          flareDistanceRef.current = Math.abs(elbow.x - shoulder.x);
        } else {
          elbowAngleRef.current = null;
          flareDistanceRef.current = null;
        }

        if (anklesVisible) {
          ankleDistanceRef.current = calculateDistance(rightAnkle, leftAnkle);
        } else {
          ankleDistanceRef.current = null;
        }

        if (kneesVisible) {
          kneeDistanceRef.current = calculateDistance(rightKnee, leftKnee);
        } else {
          kneeDistanceRef.current = null;
        }

        // --- ELBOW ---
        if (
          !elbowVisible ||
          !shoulderVisible ||
          !wristVisible ||
          flareDistanceRef.current === null ||
          elbowAngleRef.current === null
        ) {
          setFlareFeedback(
            "⚠️ Arms not fully visible. Unable to calculate elbow feedback.",
          );
        } else if (
          flareDistanceRef.current !== null &&
          flareDistanceRef.current > 0.15
        ) {
          setFlareFeedback("⚠️ Elbow too wide");
        } else if (
          elbowAngleRef.current !== null &&
          elbowAngleRef.current < 40
        ) {
          setFlareFeedback("⚠️ Arm angle too tight");
        } else {
          setFlareFeedback("✅ Good elbow alignment");
        }

        // --- ANKLES ---
        if (!anklesVisible) {
          setAnkleFeedback("⚠️ Unable to detect ankles.");
        } else if (!shouldersVisible) {
          setAnkleFeedback("⚠️ Unable to calculate shoulder distance.");
        } else if (ankleDistanceRef.current === null) {
          setAnkleFeedback("⚠️ Unable to calculate ankle distance.");
        } else if (shoulderDistanceRef.current === null) {
          setAnkleFeedback("⚠️ Unable to calculate shoulder distance.");
        } else if (
          ankleDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          ankleDistanceRef.current < shoulderDistanceRef.current - 0.05
        ) {
          setAnkleFeedback("⚠️ Feet too close");
        } else if (
          ankleDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          ankleDistanceRef.current > shoulderDistanceRef.current + 0.05
        ) {
          setAnkleFeedback("⚠️ Feet too far");
        } else {
          setAnkleFeedback("✅ Good foot spacing");
        }

        // --- KNEES ---
        if (!kneesVisible) {
          setKneeFeedback("⚠️ Unable to detect knees.");
        } else if (!shouldersVisible) {
          setKneeFeedback("⚠️ Unable to calculate shoulder distance.");
        } else if (kneeDistanceRef.current === null) {
          setKneeFeedback("⚠️ Unable to calculate knee distance.");
        } else if (shoulderDistanceRef.current === null) {
          setKneeFeedback("⚠️ Unable to calculate shoulder distance.");
        } else if (
          kneeDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          kneeDistanceRef.current < shoulderDistanceRef.current - 0.08
        ) {
          setKneeFeedback("⚠️ Knees too close");
        } else if (
          kneeDistanceRef.current !== null &&
          shoulderDistanceRef.current !== null &&
          kneeDistanceRef.current > shoulderDistanceRef.current + 0.08
        ) {
          setKneeFeedback("⚠️ Knees too far");
        } else {
          setKneeFeedback("✅ Good knee alignment");
        }
        // --- BEND ---
        if (kneeAngleRef.current === null) {
          setBendFeedback("⚠️ Unable to calculate knee bend.");
        } else if (kneeAngleRef.current < 90) {
          setBendFeedback("⚠️ Knee bend too deep.");
        } else if (kneeAngleRef.current > 120) {
          setBendFeedback("⚠️ Knee bend too shallow.");
        } else {
          setBendFeedback("✅ Good knee bend.");
        }
      }
      animationFrameId = requestAnimationFrame(detect);
    }

    init();
    detectRef.current = detect;

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <DisplayLive
      videoRef={videoRef}
      canvasRef={canvasRef}
      ankleFeedback={ankleFeedback}
      kneeFeedback={kneeFeedback}
      flareFeedback={flareFeedback}
      bendFeedback={bendFeedback}
      errorFeedback={errorFeedback}
      dominantHandRef={dominantHandRef}
    />
  );
}
