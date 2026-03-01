import { useState } from "react";
import BigMan from "./assets/BigMan.png";
import PointGuard from "./assets/PointGuard.png";
import PowerForward from "./assets/PowerForward.png";
import ShootingGuard from "./assets/ShootingGuard.png";

interface Props {
  positionRef: React.RefObject<string>;
}

export default function PositionOverlay({ positionRef }: Props) {
  const [vis, setVis] = useState(true);

  return (
    <div
      id="choice-overlay"
      className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 text-white"
      style={{ visibility: vis ? "visible" : "hidden" }}
    >
      <div
        id="choice-modal"
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-120 text-center fixed"
      >
        <span
          id="close-btn"
          className="absolute top-2 right-4 text-white hover:text-gray-300 cursor-pointer font-bold text-lg"
          onClick={() => {
            setVis(false);
            window.location.reload();
          }}
        >
          x
        </span>

        <p className="text-lg font-medium mb-6">
          What position do you play? This will help us give you more accurate
          feedback!
        </p>

        <div className="flex gap-4 justify-center items-center">
          <button
            id="point-btn"
            className="rounded overflow-hidden cursor-pointer flex flex-col gap-1 items-center font-bold"
            onClick={() => {
              positionRef.current = "point guard";
              setVis(false);
            }}
          >
            <img src={PointGuard} alt="Point Guard" />
            Point Guard
          </button>

          <button
            id="shooting-btn"
            className="rounded overflow-hidden cursor-pointer items-center flex flex-col gap-1 font-bold"
            onClick={() => {
              positionRef.current = "shooting guard";
              setVis(false);
            }}
          >
            <img src={ShootingGuard} />
            Shooting Guard
          </button>
          <button
            id="power-btn"
            className="rounded overflow-hidden cursor-pointer items-center flex flex-col gap-1 font-bold"
            onClick={() => {
              positionRef.current = "power forward";
              setVis(false);
            }}
          >
            <img src={PowerForward} />
            Power Forward
          </button>
          <button
            id="big-btn"
            className="rounded overflow-hidden cursor-pointer items-center flex flex-col gap-1 font-bold"
            onClick={() => {
              positionRef.current = "big man";
              setVis(false);
            }}
          >
            <img src={BigMan} />
            Big Man
          </button>
        </div>
      </div>
    </div>
  );
}
