import { useState } from "react";
import formButton from "./assets/BasketballForm.png";
import arcButton from "./assets/BasketballArc.png";

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
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-80 text-center font-bold"
      >
        <p className="text-lg font-medium mb-6">
          Would you like to work on your form or arc?
        </p>

        <div className="flex gap-4 justify-center items-center">
          <button
            id="form-btn"
            className="rounded overflow-hidden cursor-pointer relative"
            onClick={() => {
              setActive("FormHome");
              setVis((prev) => !prev);
            }}
          >
            <button
              id="form-btn"
              className="rounded overflow-hidden cursor-pointer relative"
              onClick={() => {
                setActive("FormHome");
                setVis((prev) => !prev);
              }}
            >
              {/* The white block - now set to z-0 */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-13 h-10 bg-white rounded-full"></div>
              </div>

              {/* The image - now set to relative and z-10 */}
              <img
                src={formButton}
                alt="Form Button"
                className="w-32 h-auto relative z-10"
              />
            </button>
          </button>

          <p>or</p>

          <button
            id="arc-btn"
            className="rounded overflow-hidden cursor-pointer relative"
            onClick={() => {
              setActive("ArcHome");
              setVis((prev) => !prev);
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-13 h-10 bg-white rounded-full"></div>
            </div>

            <img
              src={arcButton}
              alt="Arc Button"
              className="w-32 h-auto z-10 relative"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
