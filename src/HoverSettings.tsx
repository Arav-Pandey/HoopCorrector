import { useState, useRef, type ReactNode } from "react";

type Props = {
  name: string;
  children: ReactNode;
};

export default function HoverSettings({ name, children }: Props) {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleEnter = () => {
    timerRef.current = window.setTimeout(() => {
      setHovered(true);
    }, 100);
  };

  const handleLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHovered(false);
  };

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer mt-5 mb-2 hover:scale-120 transition"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}

      {hovered && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 text-sm bg-gray-800 text-white px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap mt-2">
          {name}
        </span>
      )}
    </div>
  );
}
