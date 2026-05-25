import HandOverlay from "../HandOverlay";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  ankleFeedback: string | null;
  kneeFeedback: string | null;
  flareFeedback: string | null;
  bendFeedback: string | null;
  errorFeedback: string | null;
  setDominantHand: React.Dispatch<
    React.SetStateAction<"left" | "right" | null>
  >;
}

export default function DisplayLive({
  videoRef,
  canvasRef,
  ankleFeedback,
  kneeFeedback,
  flareFeedback,
  errorFeedback,
  setDominantHand,
  bendFeedback,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <HandOverlay setDominantHand={setDominantHand} />
      {/* Video + Canvas wrapper */}
      <div className="relative w-[640px] h-[480px] mx-auto">
        {/*LIVE CAMERA FEED*/}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 🔥 AI OVERLAY */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Feedback text */}
      <div className="mt-2 text-base font-bold text-center flex flex-col gap-4">
        <p>
          Ankle placement feedback:{" "}
          {ankleFeedback === null || ankleFeedback === ""
            ? "N/A"
            : ankleFeedback}
        </p>
        <p>
          Knee placement feedback:{" "}
          {kneeFeedback === null || kneeFeedback === "" ? "N/A" : kneeFeedback}
        </p>
        <p>
          Elbow alignment feedback:{" "}
          {flareFeedback === null || flareFeedback === ""
            ? "N/A"
            : flareFeedback}
        </p>
        <p>
          Knee bend feedback:{" "}
          {bendFeedback === null || bendFeedback === "" ? "N/A" : bendFeedback}
        </p>
        <p>
          Error Feedback:{" "}
          {errorFeedback === null || errorFeedback === ""
            ? "N/A"
            : errorFeedback}
        </p>
      </div>
    </div>
  );
}
