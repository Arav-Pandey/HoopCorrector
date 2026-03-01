import { useEffect, useRef, useState } from "react";
import { connectors, webrtc } from "@roboflow/inference-sdk";

interface Props {
  videoUrl: string;
}

export default function Arc({ videoUrl }: Props) {
  const connectionRef = useRef<Awaited<
    // await because webrtc.useVideoFile is an async function
    ReturnType<typeof webrtc.useVideoFile> // typeof means "Give me a type of this function" and ReturnType gets the return type of the function
  > | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [highestBasketball, setHighestBasketball] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!videoUrl) return;

    async function startProcessing() {
      const res = await fetch(videoUrl); // Downloads the video. fetch() is a browser function used to request data from a URL.
      const blob = await res.blob(); // converts the binary response to a file that is then stored in browser memory.

      const file = new File([blob], "video.mp4", {
        type: blob.type || "video/mp4",
      }); // Converts the Blob into a File. A File is basically the same thing as a Blob but it includes filename + metadata

      processFile(file);
    }

    startProcessing();
  }, [videoUrl]);

  async function processFile(file: File) {
    setProcessing(true);
    setFrameCount(0);

    const connector = connectors.withProxyUrl("/.netlify/functions/roboflow"); // Sends AI requests to netlify backend instead of straight to roboflow

    const VIDEO_OUTPUT = "visualization";
    connectionRef.current = await webrtc.useVideoFile({
      // Processes video
      file, // File getting used
      connector, // Where to send requests through
      wrtcParams: {
        // Parameters for roboflow
        workspaceName: "basketball-znuvc",
        workflowId: "find-basketballs-rims-and-nets",
        streamOutputNames: [], // No special streaming outputs
        dataOutputNames: [VIDEO_OUTPUT, ...["predictions"]].filter(
          // VIDEO_OUTPUT gives the object boxes
          (v, i, a) => a.indexOf(v) === i, //  Predictions gets the actual objects and their coordinates. Removes duplicate values
        ),
        processingTimeout: 3600, // Maximum time the server has to process the video. (1 hour)
        requestedPlan: "webrtc-gpu-medium", // Options: webrtc-gpu-small, webrtc-gpu-medium, webrtc-gpu-large
        requestedRegion: "us", // Options: us, eu, ap
        realtimeProcessing: false, // Process the whole video file NOT a live stream
      },
      onData: (data) => {
        setFrameCount((n) => n + 1);
        const viz = data.serialized_output_data?.[VIDEO_OUTPUT]; // Accesses the video frame annotations
        if (viz?.value) setCurrentFrame(`data:image/jpeg;base64,${viz.value}`); // Converts the JPEG image returned from the backend to a browser image source
        const preds = data.serialized_output_data?.predictions?.predictions; // Returns an object detected

        if (preds) {
          preds.forEach((p: any) => {
            if (p.class === "basketball") {
              if (p.y < (highestBasketball ?? Infinity)) {
                setHighestBasketball(p.y);
              }
            }
            console.log("Class:", p.class);
            console.log("X:", p.x);
            console.log("Y:", p.y);
            console.log("Width:", p.width);
            console.log("Height:", p.height);
          });
        }
      },
      onUploadProgress: (sent, total) =>
        setProgress(Math.round((sent / total) * 100)),
      onComplete: () => setProcessing(false),
    });
  }

  return (
    <div>
      {currentFrame ? (
        <img src={currentFrame} alt="Frame" style={{ width: 640 }} />
      ) : (
        <div style={{ width: 640, height: 480, background: "#000" }} />
      )}
      {processing && (
        <p>
          Upload: {progress}% | Frames: {frameCount}
        </p>
      )}
      {!processing && frameCount > 0 && <p>✓ Processed {frameCount} frames</p>}
      {highestBasketball !== null && (
        <p>Highest Basketball Y-Coordinate: {highestBasketball}</p>
      )}
    </div>
  );
}
