import Recorder from "./Record";

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
    <div>
      <h1>
        Welcome to the form corrector. You record a video of yourself facing the
        camera (doesn't have to show the basketball hoop){" "}
      </h1>

      {/*Demo of using it here*/}

      <div>
        <Recorder
          setActive={setActive}
          setVideoURL={setVideoURL}
          videoURL={videoURL}
          usePreview={usePreview}
        />
      </div>
    </div>
  );
}
