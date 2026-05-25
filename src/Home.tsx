import { useState } from "react";
import InfoTop from "./InfoTop";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function Home({ setActive }: Props) {
  const [info, setInfo] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center font-[Inter]">
      {/* Hero Section */}
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          HoopCorrector
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Improve your shooting consistency with our dual-mode{" "}
          <InfoTop
            info={info}
            setInfo={setInfo}
            text="Proper basketball shooting form is built from the ground 
            up by aligning your body, establishing a balanced foundation, 
            and executing a repeatable, fluid mechanics sequence. While legendary
             shooters have unique quirks, all great shooters share a core foundation 
             of biomechanics"
          >
            <button onClick={() => setInfo(true)}>
              <span className="text-indigo-600 dark:text-indigo-500 font-semibold cursor-pointer">
                Form Analysis
              </span>
            </button>
          </InfoTop>{" "}
          system.
        </p>
      </header>
      <h2 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 mb-10">
        Ready to fix your mechanics?
      </h2>

      {/* Two-Part Form Analysis Grid */}
      <section className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16 text-left">
        {/* Live Analysis */}
        <div
          className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:scale-115 transition-transform duration-300"
          onClick={() => setActive("FormLive")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Live Analysis
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Get real-time feedback while you shoot. The system tracks your
              immediate mechanics, balance, and release speed on the fly.
            </p>
          </div>
        </div>

        {/* Deeper Analysis */}
        <div
          onClick={() => setActive("Form")}
          style={{ cursor: "pointer" }}
          className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:scale-115 transition-transform duration-300"
        >
          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">
              🔍 Deeper Analysis
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload or record a full clip for a comprehensive breakdown. Breaks
              down your joint alignment, shot pocket, and follow-through
              frame-by-frame.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
