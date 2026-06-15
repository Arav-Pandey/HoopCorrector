import LiveOverlay from "../LiveOverlay";
import Recorder from "../Record";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setVideoURL: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string;
}

export default function FormHome({ setActive, setVideoURL, videoURL }: Props) {
  const usePreview = () => {
    setActive("Form");
    setVideoURL(videoURL);
  };
  return (
    <div className="w-full">
      <LiveOverlay setActive={setActive} />
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
          Welcome to the form corrector
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
          Record a video of yourself facing the camera (doesn't have to show the basketball hoop)
        </p>
      </div>

      <div className="px-4 sm:px-6">
        <Recorder
          setVideoURL={setVideoURL}
          videoURL={videoURL}
          usePreview={usePreview}
        />
      </div>
    </div>
  );
}
