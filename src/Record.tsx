import { useEffect, useRef, useState } from "react";

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

  const [recording, setRecording] = useState(false);

  useEffect(() => {
    async function setupCamera() {
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
    <div>
      <video ref={videoRef} autoPlay playsInline muted />{" "}
      {/*shows the live camera feed, not the recording.*/}
      <button onClick={toggleRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoURL} controls />
          <div className="flex flex-col">
            <button className="cursor-pointer" onClick={() => clearPreview()}>
              Remove Video
            </button>
            <button
              className="mt-1 cursor-pointer"
              onClick={() => usePreview(videoURL)}
            >
              Use Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
