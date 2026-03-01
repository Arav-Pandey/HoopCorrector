import { useState } from "react";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function Overlay({ setActive }: Props) {
  const [vis, setVis] = useState(true);

  return (
    <div
      id="choice-overlay"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{ visibility: vis ? "visible" : "hidden" }}
    >
      <div
        id="choice-modal"
        className="bg-white rounded-lg shadow-lg p-6 w-80 text-center"
      >
        <p className="text-lg font-medium mb-6">
          Would you like to work on your form or arc?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            id="form-btn"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              setActive("FormHome");
              setVis((prev) => !prev);
            }}
          >
            Form
          </button>

          <button
            id="arc-btn"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              setActive("ArcHome");
              setVis((prev) => !prev);
            }}
          >
            Arc
          </button>
        </div>
      </div>
    </div>
  );
}
