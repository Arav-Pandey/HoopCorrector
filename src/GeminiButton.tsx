import { useEffect, useState } from "react";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function GeminiButton({ setActive }: Props) {
  const [vis, setVis] = useState(true);

  return (
    <div className="relative p-1 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-800">
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
        className="relative w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white p-3 sm:p-4 rounded-lg sm:rounded-[14px] outline-none cursor-pointer text-sm sm:text-base font-medium transition hover:scale-95 active:scale-90"
        onClick={() => setActive("Feedback")}
      >
        Dive Deeper with Google Gemini
      </button>
    </div>
  );
}
