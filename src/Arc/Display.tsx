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
    <div className="flex flex-col items-center">
      <PositionOverlay positionRef={positionRef} />
      {currentFrame ? (
        <img src={currentFrame} alt="Frame" style={{ width: 640 }} />
      ) : (
        <div style={{ width: 640, height: 480, background: "#000" }} />
      )}
      <button
        onClick={() => rewatch()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Rewatch Video
      </button>
      {processing && (
        <p>
          Upload: {progress}% | Frames: {frameCount}
        </p>
      )}
      {!processing && frameCount > 0 && <p>✓ Processed {frameCount} frames</p>}
      {highestBasketball !== null ? (
        <p>Highest Basketball Y-Coordinate: {highestBasketball}</p>
      ) : (
        <p>
          Could not find basketball. Please make sure the basketball is fully
          visible and seen in the video. :(
        </p>
      )}
      {rimHeight !== null ? (
        <p>Rim Y-Coordinate: {rimHeight}</p>
      ) : (
        <p>
          Could not find rim. Please make sure the rim is fully visible and seen
          in the video. :(
        </p>
      )}

      {feedback && <p>{feedback}</p>}
      {launchAngle !== null ? (
        <p>Estimated Launch Angle: {launchAngle.toFixed(2)} degrees</p>
      ) : (
        <p>
          Could not estimate launch angle. Please make sure the video clearly
          shows the ball's release and initial trajectory. :(
        </p>
      )}
    </div>
  );
}
