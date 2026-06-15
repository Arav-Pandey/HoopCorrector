import { useEffect, useRef, useState } from "react";
import UploadButton from "./UploadButton";

interface Props {
  setVideoURL: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string;
  usePreview: (videoURL: string) => void;
  setVideoFile?: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function Recorder({ setVideoURL, videoURL, usePreview, setVideoFile }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [recording, setRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const clearPreview = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL); // cleanup memory
    }
    setVideoURL("");
  };

  const onCameraDenied = () => {
    alert(
      "Camera access is required to record your form. Please allow camera access and refresh the page.",
    );
  };

  // Get the best supported MIME type for video recording
  const getSupportedMimeType = (): string => {
    const candidates = [
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/quicktime",
    ];

    for (const mimeType of candidates) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        console.log("Using MIME type:", mimeType);
        return mimeType;
      }
    }

    // Fallback - let the browser choose
    console.log("No specific MIME type supported, using default");
    return "";
  };

  useEffect(() => {
    async function setupCamera() {
      try {
        // Stop previous stream if exists
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          // broswer API that asks for permission to get live camera feed and then returns that data
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: facingMode
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream; //Displays the live camera feed
        }

        streamRef.current = stream;

        const mimeType = getSupportedMimeType();
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

        recorder.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          alert("Recording error: " + event.error);
          setRecording(false);
        };

        recorder.ondataavailable = (event) => {
          // When the stream is stopped, the media recorder returns chunks
          if (event.data.size > 0) {
            chunksRef.current.push(event.data); // Pushes all the chunks into the array of blobs
          }
        };

        recorder.onstop = () => {
          const mimeType = recorder.mimeType || "video/webm";
          const blob = new Blob(chunksRef.current, { type: mimeType }); // Makes a video that is recorded
          console.log("Recording complete. MIME type:", mimeType, "Blob size:", blob.size);
          
          if (blob.size === 0) {
            alert("Recording failed - no data captured. Please try again.");
            chunksRef.current = [];
            return;
          }
          
          // Create a File object for processing (better for iPad/Safari compatibility)
          const file = new File([blob], "video.mp4", { type: mimeType });
          setVideoFile?.(file);
          
          const url = URL.createObjectURL(blob); // Makes a url link to the video in memory. For example, blob:http://localhost:5713/{random generated link}
          setVideoURL(url);
          chunksRef.current = []; // clears data from the array
        };

        mediaRecorderRef.current = recorder; // makes so that the mediaRecorderRef can access the recorder
      } catch (error) {
        onCameraDenied();
        console.log("Error accessing camera:", error);
      }
    }

    setupCamera();
  }, [facingMode]);

  const toggleRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (!recording) {
      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const flipCamera = async () => {
    if (recording) {
      alert("Stop recording before flipping the camera");
      return;
    }
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-6 px-4 sm:py-8 text-white">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl sm:rounded-[2rem] border border-orange-500/30 bg-slate-900/70 p-4 sm:p-6 lg:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,159,67,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,99,71,0.12),_transparent_35%)]" />
        <div className="relative space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Record Your Shot
            </h1>
            <p className="text-sm sm:text-base lg:text-lg leading-6 sm:leading-8 text-slate-300">
              Position your camera to capture your full shooting form. You can use your device's front or back camera.
            </p>
          </div>

          {/* Live camera */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-[2rem] border border-white/10 bg-slate-950/80 p-3 sm:p-4 shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg sm:rounded-2xl"
            />
            {recording && (
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 rounded-full bg-red-500/90 px-3 sm:px-4 py-1.5 sm:py-2">
                <span className="inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-200 animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold text-white">Recording</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={toggleRecording}
                className={`w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold transition active:scale-95
                ${
                  recording
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:scale-[1.01] hover:brightness-110"
                    : "bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/25 hover:scale-[1.01] hover:brightness-110"
                }`}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </button>

              <button
                onClick={flipCamera}
                disabled={recording}
                className={`w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold transition active:scale-95
                ${
                  recording
                    ? "border border-white/15 bg-white/5 text-white opacity-50 cursor-not-allowed"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
                title="Flip camera (front/back)"
              >
                📷 Flip Camera
              </button>

              <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-white/10 active:scale-95">
                <UploadButton setVideoURL={setVideoURL} />
              </button>
            </div>
            <p className="text-center text-xs sm:text-sm text-slate-400">
              Or upload an existing video
            </p>
          </div>

          {/* Preview Section */}
          {videoURL && (
            <div className="space-y-4 sm:space-y-6 border-t border-white/10 pt-6 sm:pt-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Recording Preview</h2>
                <div className="relative overflow-hidden rounded-xl sm:rounded-[2rem] border border-white/10 bg-slate-950/80 p-3 sm:p-4 shadow-xl">
                  <video src={videoURL} controls className="w-full rounded-lg sm:rounded-2xl" />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 sm:gap-4 sm:flex-row sm:justify-center">
                {/* Remove button */}
                <button
                  onClick={() => clearPreview()}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-red-500/20 active:scale-95"
                >
                  Remove
                </button>

                {/* Use button */}
                <button
                  onClick={() => usePreview(videoURL)}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-green-500/25 transition hover:scale-[1.01] hover:brightness-110 active:scale-95"
                >
                  Use This Video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
