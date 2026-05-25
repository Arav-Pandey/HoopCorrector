import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import GeminiButton from "../GeminiButton";
import HandOverlay from "../HandOverlay";
import LandmarkLine from "../LandmarkLine";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  rewatchFeedback: () => void;
  ankleFeedback: string | null;
  kneeFeedback: string | null;
  flareFeedback: string | null;
  elbowScore: number | null;
  errorFeedback: string | null;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  flareScore: number | null;
  angleScore: number | null;
  similarity: React.RefObject<number | null>;
  setDominantHand: React.Dispatch<
    React.SetStateAction<"left" | "right" | null>
  >;
  bendFeedeback: string | null;
  bendScore: number | null;
  rightShoulderRef: React.RefObject<NormalizedLandmark | null>;
  leftShoulderRef: React.RefObject<NormalizedLandmark | null>;
  rightElbowRef: React.RefObject<NormalizedLandmark | null>;
  leftElbowRef: React.RefObject<NormalizedLandmark | null>;
}

export default function Display({
  videoRef,
  canvasRef,
  rewatchFeedback,
  ankleFeedback,
  kneeFeedback,
  flareFeedback,
  elbowScore,
  errorFeedback,
  setActive,
  flareScore,
  angleScore,
  similarity,
  setDominantHand,
  bendFeedeback,
  bendScore,
  rightShoulderRef,
  leftShoulderRef,
  rightElbowRef,
  leftElbowRef,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <HandOverlay setDominantHand={setDominantHand} />
      {/* Video + Canvas wrapper */}
      <div className="relative w-[640px] h-[480px] mx-auto">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        {rightShoulderRef.current && rightElbowRef.current && (
          <LandmarkLine
            a={rightShoulderRef.current}
            b={rightElbowRef.current}
          />
        )}
      </div>
      <button
        onClick={() => rewatchFeedback()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Rewatch Feedback
      </button>
      {/* Feedback text */}
      <div className="mt-2 text-base font-bold text-center flex flex-col gap-4 mb-5">
        <p>
          Ankle placement feedback:{" "}
          {ankleFeedback !== null && ankleFeedback !== ""
            ? `${ankleFeedback}`
            : "N/A"}
        </p>
        <p>
          Knee placement feedback:{" "}
          {kneeFeedback !== null && kneeFeedback !== ""
            ? `${kneeFeedback}`
            : "N/A"}
        </p>
        <p>
          Elbow alignment feedback:{" "}
          {flareFeedback !== null && flareFeedback !== ""
            ? `${flareFeedback}`
            : "N/A"}
        </p>
        <p>
          Knee Bend feedback:{" "}
          {bendFeedeback !== null && bendFeedeback !== ""
            ? `${bendFeedeback}`
            : "N/A"}
        </p>
        <p>
          Elbow score:{" "}
          {elbowScore !== null ? elbowScore.toFixed(2) + "%" : "N/A"}
        </p>
        <p>
          Flare score:{" "}
          {flareScore !== null ? flareScore.toFixed(2) + "%" : "N/A"}
        </p>
        <p>
          Angle score:{" "}
          {angleScore !== null ? angleScore.toFixed(2) + "%" : "N/A"}
        </p>
        <p>
          Bend score: {bendScore !== null ? bendScore.toFixed(2) + "%" : "N/A"}
        </p>
        <p>
          Similarity to Steph Curry's Shot:{" "}
          {similarity.current !== null
            ? similarity.current.toFixed(2) + "%"
            : "N/A"}
        </p>
        <p>
          Errors:{" "}
          {errorFeedback === null || errorFeedback === ""
            ? "N/A"
            : errorFeedback}
        </p>
      </div>
      <GeminiButton setActive={setActive} />
    </div>
  );
}
