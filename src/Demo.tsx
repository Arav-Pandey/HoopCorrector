interface DemoProps {
  onClose: () => void;
}

export default function Demo({ onClose }: DemoProps) {
  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen bg-black relative p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 hover:border-orange-400/60 transition-all backdrop-blur-md active:scale-95"
        aria-label="Close demo"
      >
        <span className="text-orange-300 hover:text-orange-200 font-bold text-lg sm:text-xl transition-colors">×</span>
      </button>

      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">Demo coming soon!</p>
    </div>
  );
}