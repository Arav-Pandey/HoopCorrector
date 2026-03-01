import Recorder from "../Record";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setVideoURL: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string;
}

export default function ArcHome({ setActive, setVideoURL, videoURL }: Props) {
  const usePreview = () => {
    setActive("Arc");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Arc Corrector</h1>
      <h1>
        Welcome to the Arc Corrector. In this part you record a video of
        yourself shooting a basketball(must see the basketball hoop and the
        basketball in the air). Then, Google Gemini will give you feedback on
        how to improve your shot or if your shot is already great.
      </h1>
      {/*Demo of using it here*/}

      <div>
        <Recorder
          setVideoURL={setVideoURL}
          videoURL={videoURL}
          usePreview={usePreview}
        />
      </div>
    </div>
  );
}
