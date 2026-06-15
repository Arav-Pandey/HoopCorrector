import { useState, type ChangeEvent } from "react";
import HoverSettings from "../HoverSettings";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { MdMenuOpen } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";

interface Props {
  onAddShotSpot: () => void;
  onRemoveShotSpot: () => void;
  controlVis: boolean;
  setControlVis: React.Dispatch<React.SetStateAction<boolean>>;
  pass: boolean;
  setPass: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ControlLeft({
  onAddShotSpot,
  onRemoveShotSpot,
  controlVis,
  setControlVis,
  pass,
  setPass,
}: Props) {
  const [showMenuTooltip, setShowMenuTooltip] = useState(false);

  function handleAddButton(
    name: string,
    onClick: () => void,
    Icon: React.ReactNode,
  ) {
    return (
      <HoverSettings name={name}>
        <button
          onClick={onClick}
          className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-2xl text-white transition hover:bg-white/15 active:scale-95 cursor-pointer"
          aria-label={name}
        >
          {Icon}
        </button>
      </HoverSettings>
    );
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.checked);
  };

  return (
    <>
      {controlVis ? (
        <div
          className={`fixed top-1/2 left-0 z-50 -translate-y-1/2 px-2 sm:px-0`}
        >
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-white/15 bg-gray-800/80 px-2 sm:px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            {/* Centered Heading */}
            <div className="flex flex-row items-center justify-around w-full">
              <h3 className="text-white font-bold text-center text-xs sm:text-sm">Controls</h3>
            </div>

            {/* Two Column Container */}
            <div className="flex flex-row gap-2 sm:gap-4 items-start">
              {/* Column 1 */}
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                {handleAddButton(
                  "Add shot spot",
                  onAddShotSpot,
                  <BsFillRecordCircleFill size={20} className="sm:w-6 sm:h-6" />,
                )}
                <span className="text-xs text-white text-center">
                  Add shot
                </span>
                {/* Checkbox for pass or not */}
                <label className="text-xs text-white">
                  <input
                    type="checkbox"
                    checked={pass}
                    onChange={handleCheckboxChange}
                    className="mr-1"
                  />
                  Pass
                </label>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                {handleAddButton(
                  "Remove shot spot",
                  onRemoveShotSpot,
                  <RiCloseCircleFill size={20} className="sm:w-6 sm:h-6" />,
                )}
                <span className="text-xs text-white text-center">
                  Remove
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-6 sm:top-10 left-2 sm:left-10 z-50">
          <button
            className="bg-gray-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2 cursor-pointer hover:bg-gray-600 transition active:scale-95"
            onClick={() => setControlVis(!controlVis)}
            onMouseEnter={() => setShowMenuTooltip(true)}
            onMouseLeave={() => setShowMenuTooltip(false)}
            aria-label="Show Controls"
          >
            <MdMenuOpen size={24} className="sm:w-10 sm:h-10" />
          </button>
          {showMenuTooltip && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs sm:text-sm bg-gray-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
              Show Controls
            </span>
          )}
        </div>
      )}
    </>
  );
}
