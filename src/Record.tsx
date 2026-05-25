import { useEffect, useRef, useState } from "react";
import UploadButton from "./UploadButton";

interface Props {
  setVideoURL: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string;
  usePreview: (videoURL: string) => void;
}

export default function Recorder({ setVideoURL, videoURL, usePreview }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  const [recording, setRecording] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // broswer API that asks for permission to get live camera feed and then returns that data
          video: { width: 640, height: 480 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream; //Displays the live camera feed
        }

        const recorder = new MediaRecorder(stream); // Perpares the recorder but not recording yet

        recorder.ondataavailable = (event) => {
          // When the stream is stopped, the media recorder returns chunks
          if (event.data.size > 0) {
            chunksRef.current.push(event.data); // Pushes all the chunks into the array of blobs
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" }); // Makes a video that is recorded
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
  }, []);

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

  return (
    <div className="flex justify-center items-center flex-col space-y-5">
      {/* Live camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-lg shadow-md"
      />

      {/* Start / Stop button */}
      <div className="flex gap-5 justify-center items-center">
        <button
          onClick={toggleRecording}
          className={`px-6 py-2 rounded-md font-medium border-4 transition-all duration-200
      bg-gray-100 text-gray-800 transform
      ${
        recording
          ? "border-red-500 hover:border-red-600 hover:bg-gray-300 hover:scale-105"
          : "border-orange-500 hover:border-orange-600 hover:bg-gray-300 hover:scale-105 hover:shadow-[0_0_10px_rgba(249,115,22,0.5)] cursor-pointer"
      }`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        <button className="flex flex-col items-center gap-1 cursor-pointer">
          <UploadButton setVideoURL={setVideoURL} />
          <span className="text-sm text-white font-bold">
            Or Upload a Video
          </span>
        </button>
      </div>

      {videoURL && (
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold">Recorded Video:</h3>

          <video src={videoURL} controls className="rounded-lg shadow-md" />

          <div className="flex gap-3">
            {/* Remove button */}
            <button
              onClick={() => clearPreview()}
              className="px-5 py-2 rounded-md border-4 border-orange-600 
            bg-gray-100 text-gray-700 transition-all duration-200 transform
            hover:bg-gray-300 hover:border-red-600 hover:scale-105 cursor-pointer hover:shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            >
              Remove
            </button>

            {/* Use button */}
            <button
              onClick={() => usePreview(videoURL)}
              className="px-5 py-2 rounded-md border-4 border-orange-600 
            bg-gray-100 text-gray-800 transition-all duration-200 transform
            hover:border-green-600 hover:bg-gray-300 hover:scale-105 cursor-pointer
            hover:shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            >
              Use Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
