import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import GeminiButton from "./GeminiButton";

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
  const [feedback, setFeedback] = useState("Loading model...");

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
        detect();
      };
    }

    function calculateAngle(a: any, b: any, c: any) {
      const ab = { x: a.x - b.x, y: a.y - b.y };
      const cb = { x: c.x - b.x, y: c.y - b.y };

      const dot = ab.x * cb.x + ab.y * cb.y;
      const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
      const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

      const angle = Math.acos(dot / (magAB * magCB));
      return (angle * 180) / Math.PI;
    }

    function detect() {
      if (!videoRef.current || !canvasRef.current || !poseLandmarker) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d"); // Think of canvas as the sheet of paper and the ctx(context) as the pen or pencil. Without ctx canvas is useless.
      if (!ctx) return;

      if (video.paused || video.ended) return;

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

        // === RIGHT ARM ===
        const rightShoulder = landmarks[12];
        const rightElbow = landmarks[14];
        const rightWrist = landmarks[16];

        const elbowAngle = calculateAngle(
          rightShoulder,
          rightElbow,
          rightWrist,
        );

        // Elbow flare detection
        const flareDistance = Math.abs(rightElbow.x - rightShoulder.x);
        setContextList([
          ...contextList,
          `Shooting elbow is ${flareDistance} pixels off of in line with the shooting shoulder.`,
        ]);

        if (flareDistance > 0.15) {
          setFeedback("⚠️ Elbow is flaring too wide");
        } else if (elbowAngle < 40) {
          setFeedback("⚠️ Arm angle too tight");
        } else {
          setFeedback("✅ Good elbow alignment");
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    }

    init();

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoURL]);

  return (
    <div className="flex flex-col items-center">
      {/* Video + Canvas wrapper */}
      <div className="relative w-\[640px\] h-\[480px\]">
        <video
          ref={videoRef}
          width={640}
          height={480}
          playsInline
          muted
          className="block"
        />

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Feedback text */}
      <div className="mt-2 text-base font-bold">{feedback}</div>

      <GeminiButton setActive={setActive} />
    </div>
  );
}
