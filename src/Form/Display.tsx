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
    <div className="flex flex-col items-center w-full px-4 sm:px-6 py-6 sm:py-8">
      <HandOverlay setDominantHand={setDominantHand} />
      {/* Video + Canvas wrapper - responsive aspect ratio */}
      <div className="relative w-full max-w-2xl aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-contain"
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
        className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 text-sm sm:text-base font-semibold rounded-lg shadow-lg shadow-orange-500/25 hover:scale-[1.02] hover:brightness-110 transition active:scale-95"
      >
        Rewatch Feedback
      </button>
      
      {/* Feedback text */}
      <div className="mt-8 sm:mt-12 w-full max-w-4xl mx-auto space-y-4 mb-5">
        <div className="rounded-xl sm:rounded-2xl border border-orange-500/30 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-xl space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Ankle Placement</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {ankleFeedback !== null && ankleFeedback !== ""
                  ? `${ankleFeedback}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Knee Placement</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {kneeFeedback !== null && kneeFeedback !== ""
                  ? `${kneeFeedback}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Elbow Alignment</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {flareFeedback !== null && flareFeedback !== ""
                  ? `${flareFeedback}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Knee Bend</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {bendFeedeback !== null && bendFeedeback !== ""
                  ? `${bendFeedeback}`
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Elbow Score</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {elbowScore !== null ? elbowScore.toFixed(2) + "%" : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Flare Score</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {flareScore !== null ? flareScore.toFixed(2) + "%" : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Angle Score</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {angleScore !== null ? angleScore.toFixed(2) + "%" : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Bend Score</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {bendScore !== null ? bendScore.toFixed(2) + "%" : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Similarity</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">
                {similarity.current !== null
                  ? similarity.current.toFixed(2) + "%"
                  : "N/A"}
              </p>
            </div>
            {errorFeedback !== null && errorFeedback !== "" && (
              <div>
                <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Errors</p>
                <p className="text-white text-sm font-medium mt-1">{errorFeedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <GeminiButton setActive={setActive} />
    </div>
  );
}
