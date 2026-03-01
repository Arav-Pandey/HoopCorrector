interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function GeminiButton({ setActive }: Props) {
  return (
    <button
      className="relative inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden"
      onClick={() => setActive("Feedback")}
    >
      <span
        className="absolute -inset-1 rounded-full animate-spin [animation-duration:2s]
    bg-[conic-gradient(from_0deg,#4285F4,#DB4437,#F4B400,#0F9D58,#4285F4)]"
      />

      <span
        className="relative z-10 flex items-center justify-center
    rounded-full bg-[#1f1f1f]
    px-6 py-2 text-sm font-medium text-white cursor-pointer"
      >
        Dive deeper in AI Mode
      </span>
    </button>
  );
}
