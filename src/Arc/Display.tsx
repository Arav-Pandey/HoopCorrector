import PositionOverlay from "../PositionOverlay";

interface Props {
  currentFrame: string | null;
  rewatch: () => void;
  processing: boolean;
  progress: number;
  frameCount: number;
  highestBasketball: number | null;
  rimHeight: number | null;
  feedback: string | null;
  launchAngle: number | null;
  positionRef: React.RefObject<string>;
}

export default function Display({
  currentFrame,
  rewatch,
  processing,
  progress,
  frameCount,
  highestBasketball,
  rimHeight,
  feedback,
  launchAngle,
  positionRef,
}: Props) {
  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-6 py-6 sm:py-8">
      <PositionOverlay positionRef={positionRef} />
      <div className="w-full max-w-2xl">
        {currentFrame ? (
          <img src={currentFrame} alt="Frame" className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl" />
        ) : (
          <div className="w-full aspect-video bg-black rounded-xl sm:rounded-2xl shadow-xl" />
        )}
      </div>
      <button
        onClick={() => rewatch()}
        className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 text-sm sm:text-base font-semibold rounded-lg shadow-lg shadow-orange-500/25 hover:scale-[1.02] hover:brightness-110 transition active:scale-95"
      >
        Rewatch Video
      </button>
      <div className="mt-8 sm:mt-12 w-full max-w-2xl mx-auto">
        <div className="rounded-xl sm:rounded-2xl border border-orange-500/30 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-xl space-y-4">
          {processing && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Processing</p>
                  <p className="text-orange-300 text-sm font-semibold">{progress}%</p>
                </div>
                <div className="w-full h-2 sm:h-3 bg-slate-800 rounded-full overflow-hidden border border-orange-500/30">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-slate-300 text-xs">Frames processed: {frameCount}</p>
            </div>
          )}
          {!processing && frameCount > 0 && (
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Status</p>
              <p className="text-white text-xs sm:text-sm font-medium mt-1">✓ Processed {frameCount} frames</p>
            </div>
          )}
          
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Basketball Detection</p>
              {highestBasketball !== null ? (
                <p className="text-white text-xs sm:text-sm font-medium mt-1">Y-Coordinate: {highestBasketball}</p>
              ) : (
                <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1">Could not find basketball. Please make sure it's fully visible in the video.</p>
              )}
            </div>
            
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Rim Detection</p>
              {rimHeight !== null ? (
                <p className="text-white text-sm font-medium mt-1">Y-Coordinate: {rimHeight}</p>
              ) : (
                <p className="text-slate-300 text-sm font-medium mt-1">Could not find rim. Please make sure it's fully visible in the video.</p>
              )}
            </div>
            
            <div>
              <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Launch Angle</p>
              {launchAngle !== null ? (
                <p className="text-white text-sm font-medium mt-1">{launchAngle.toFixed(2)}°</p>
              ) : (
                <p className="text-slate-300 text-sm font-medium mt-1">Could not estimate launch angle. Please ensure the video shows the ball's release and initial trajectory.</p>
              )}
            </div>
            
            {feedback && (
              <div>
                <p className="text-orange-300 text-xs uppercase font-semibold tracking-widest">Feedback</p>
                <p className="text-white text-sm font-medium mt-1">{feedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
