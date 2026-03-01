import { useEffect, useState } from "react";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function GeminiButton({ setActive }: Props) {
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVis(false), 8000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="relative p-1 rounded-2xl overflow-hidden bg-zinc-800">
      {/* The LED ring with transition logic */}
      <div
        className={`
          absolute inset-[-150%] animate-border-spin 
          transition-opacity duration-1000 
          ${vis ? "opacity-100" : "opacity-0"}
        `}
        style={{
          background: `conic-gradient(
            from var(--border-angle), 
            transparent 40%, 
            #4285F4, #EA4335, #FBBC05, #34A853, 
            transparent 60%
          )`,
        }}
      />

      <button
        className="relative w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white p-4 rounded-[14px] outline-none cursor-pointer"
        onClick={() => setActive("Feedback")}
      >
        Dive Deeper with Google Gemini
      </button>
      {/* <button
        className="relative inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden"
        onClick={() => setActive("Feedback")}
      >
        <span
          className="absolute -inset-1 rounded-full animate-spin [animation-duration:4s]
    bg-[conic-gradient(from_0deg,#4285F4,#DB4437,#F4B400,#0F9D58,#4285F4)]"
        />

        <span
          className="relative z-10 flex items-center justify-center
    rounded-full bg-[#1f1f1f]
    px-6 py-2 text-sm font-medium text-white cursor-pointer"
        >
          Dive deeper in AI Mode
        </span>
      </button> */}
    </div>
  );
}
