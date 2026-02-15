import { useEffect, useRef, useState } from "react";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function Recorder({ setActive }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const clearPreview = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL); // cleanup memory
    }
    setVideoURL(null);
  };

  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [finalURL, setFinalURL] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        chunksRef.current = [];
      };

      mediaRecorderRef.current = recorder;
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

  const usePreview = () => {
    setFinalURL(videoURL);
    setActive("Feedback");
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />

      <button onClick={toggleRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoURL} controls />
          <div className="flex flex-col">
            <button className="cursor-pointer" onClick={clearPreview}>
              Remove Video
            </button>
            <button className="mt-1 cursor-pointer" onClick={usePreview}>
              Use Video
            </button>
          </div>
        </div>
      )}
      <button></button>
    </div>
  );
}
