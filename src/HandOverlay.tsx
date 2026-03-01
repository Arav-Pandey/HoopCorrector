import { useState } from "react";
import { MdBackHand } from "react-icons/md";
import { IoHandLeft } from "react-icons/io5";

interface Props {
  dominantHandRef: React.RefObject<"left" | "right">;
}

export default function HandOverlay({ dominantHandRef }: Props) {
  const [vis, setVis] = useState(true);

  return (
    <div
      id="choice-overlay"
      className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 text-white"
      style={{ visibility: vis ? "visible" : "hidden" }}
    >
      <div
        id="choice-modal"
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-80 text-center fixed"
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
          Which hand do you shoot with? This will help us give you more accurate
          feedback!
        </p>

        <div className="flex gap-4 justify-center items-center">
          <button
            id="arc-btn"
            className="rounded overflow-hidden cursor-pointer flex flex-col gap-1 items-center mr-5 font-bold"
            onClick={() => {
              dominantHandRef.current = "left";
              console.log("Dominant Hand:", "left");
              setVis(false);
            }}
          >
            <IoHandLeft size={25} color="white" />
            Left
          </button>

          <p className="font-bold">or</p>

          <button
            id="form-btn"
            className="rounded overflow-hidden cursor-pointer items-center flex flex-col gap-1 ml-5 font-bold"
            onClick={() => {
              dominantHandRef.current = "right";
              setVis(false);
            }}
          >
            <MdBackHand size={25} color="white" />
            Right
          </button>
        </div>
      </div>
    </div>
  );
}
