import GeminiButton from "../GeminiButton";
import HandOverlay from "../HandOverlay";

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
  dominantHandRef: React.RefObject<"left" | "right">;
  bendFeedeback: string | null;
  bendScore: number | null;
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
  dominantHandRef,
  bendFeedeback,
  bendScore,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <HandOverlay dominantHandRef={dominantHandRef} />
      {/* Video + Canvas wrapper */}
      <div className="relative w-160 h-120 mx-auto">
        <video ref={videoRef} width={640} height={480} playsInline muted />

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
      <button
        onClick={() => rewatchFeedback()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Rewatch Feedback
      </button>

      {/* Feedback text */}
      <div className="mt-2 text-base font-bold text-center flex flex-col gap-4">
        <p>Ankle placement feedback: {ankleFeedback}</p>
        <p>Knee placement feedback: {kneeFeedback}</p>
        <p>Elbow alignment feedback: {flareFeedback}</p>
        <p>Knee Bend feedback: {bendFeedeback}</p>
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
        <p>Errors: {errorFeedback}</p>
      </div>

      <GeminiButton setActive={setActive} />
    </div>
  );
}
