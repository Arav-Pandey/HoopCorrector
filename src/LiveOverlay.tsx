import { useState } from "react";
import Brain from "./assets/Brain.png";
import DeepBrain from "./assets/DeepBrain.png";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function Overlay({ setActive }: Props) {
  const [vis, setVis] = useState(true);

  return (
    <div
      id="choice-overlay"
      className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 text-white"
      style={{ visibility: vis ? "visible" : "hidden" }}
    >
      <div
        id="choice-modal"
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-80 text-center"
      >
        <p className="text-lg font-medium mb-6">
          Would you like to have live feedback or recorded and deeper anaslysis?
        </p>

        <div className="flex gap-4 justify-center items-center">
          <button
            id="form-btn"
            className="rounded overflow-hidden cursor-pointer flex flex-col items-center gap-1 font-bold mr-2"
            onClick={() => {
              setActive("FormHome");
              setVis((prev) => !prev);
            }}
          >
            <img src={DeepBrain} alt="Deeper" className="w-17 h-auto" />
            Deeper
          </button>

          <p>or</p>

          <button
            id="arc-btn"
            className="rounded overflow-hidden cursor-pointer flex flex-col items-center gap-1 font-bold ml-2"
            onClick={() => {
              setActive("FormLive");
              setVis((prev) => !prev);
            }}
          >
            <img src={Brain} alt="Live" className="w-17 h-auto" />
            Live
          </button>
        </div>
      </div>
    </div>
  );
}
