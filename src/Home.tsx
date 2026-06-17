import { useEffect, useRef, useState } from "react";
import Steph from "./assets/Steph_Image.png";
import DefinitionTooltip from "./InfoTop";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function Home({ setActive }: Props) {
  // const [activeDefinition, setActiveDefinition] = useState<"form" | "arc" | null>(null);
  const [activeDefinition, setActiveDefinition] = useState<"form" | null>(null);
  const definitionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDefinition &&
        definitionRef.current &&
        !definitionRef.current.contains(event.target as Node)
      ) {
        setActiveDefinition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDefinition]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-4 px-4 sm:py-5 text-white">
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-4xl border border-orange-500/30 bg-slate-900/70 p-4 sm:p-5 lg:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,159,67,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,99,71,0.12),transparent_35%)]" />
        <div className="relative grid gap-6 sm:gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-orange-200">
              <span className="inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-orange-400" />
              <span>Basketball shot analysis made simple and faster</span>
            </div>

            <div className="space-y-4">
              <div className="relative max-w-2xl" ref={definitionRef}>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white">
                  Build a better shot with smarter{" "}
                  <DefinitionTooltip
                    term="form"
                    title="Form"
                    definition="Form is your shooting posture and body control — how you position your feet, balance, and deliver the ball consistently."
                    isOpen={activeDefinition === "form"}
                    onOpen={() => setActiveDefinition("form")}
                    onClose={() => setActiveDefinition(null)}
                  />{" "}
                  {/* and{' '}
                  <span className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setActiveDefinition("arc")}
                      className="font-semibold text-orange-300 underline decoration-orange-400/70 transition hover:text-orange-200"
                    >
                      arc
                    </button>
                    {activeDefinition === "arc" && (
                      <div className="absolute left-1/2 top-full z-10 mt-2 w-60 sm:w-72 -translate-x-1/2 rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-3 sm:p-4 text-xs sm:text-sm text-slate-200 shadow-2xl">
                        <div className="absolute left-1/2 top-0 h-3 w-3 sm:h-4 sm:w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-slate-950/95 border-t border-l border-white/10" />
                        <button
                          type="button"
                          onClick={() => setActiveDefinition(null)}
                          className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
                          aria-label="Close definition"
                        >
                          ×
                        </button>
                        <p className="font-semibold text-white">Arc</p>
                        <p className="mt-2 text-slate-300">
                          Arc is the path the ball follows toward the basket — the height and curve that help the shot land softly and accurately.
                        </p>
                      </div>
                    )}
                  </span>{' '} */}
                  feedback.
                </h1>
                <p className="mt-4 text-sm sm:text-base lg:text-lg leading-7 sm:leading-8 text-slate-300">
                  HoopCorrector brings a premium basketball training experience
                  to your browser. Improve your shooting with intelligent body
                  alignment analysis, ball trajectory insights, and
                  easy-to-follow feedback tailored for every player.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-[0_12px_45px_rgba(255,140,0,0.08)]">
                <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-orange-300">
                  Focus
                </p>
                <p className="mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-slate-200">
                  {/* Analyze form, balance, release, and the arc of every shot. */}
                  Analyze form, balance, and release for every shot.
                </p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-[0_12px_45px_rgba(255,140,0,0.08)]">
                <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-orange-300">
                  Experience
                </p>
                <p className="mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-slate-200">
                  A polished training hub built for modern players and fast
                  improvement.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 sm:gap-6 sm:flex-row sm:items-center">
              <button
                onClick={() => setActive("Record")}
                className=" cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-slate-950 shadow-xl shadow-orange-500/25 transition hover:scale-[1.02] hover:brightness-110 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute -inset-4 rounded-4xl bg-linear-to-br from-orange-500/25 via-transparent to-slate-900/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/80 p-2 sm:p-3 shadow-xl">
              <img
                src={Steph}
                alt="Basketball illustration"
                className="relative mx-auto h-58 sm:h-66 lg:h-70 w-auto object-contain"
              />
              <div className="mt-2 sm:mt-3 rounded-2xl sm:rounded-3xl bg-slate-900/85 p-3 sm:p-4 text-xs sm:text-sm text-slate-300 ring-1 ring-white/10">
                <p className="font-semibold text-white">
                  {" "}
                  Start your shot review{" "}
                </p>
                <p className="mt-2 text-slate-400">
                  {" "}
                  Tap “Get Started” to record a shot, then choose form
                  feedback.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Record with confidence",
            description:
              "Capture your shot and get actionable feedback in seconds.",
          },
          {
            label: "Understand your release",
            description: "See where your form can stay consistent and smooth.",
          },
          {
            label: "Compare to NBA players",
            description:
              "Find shot similarity to NBA players and learn how much your form matches theirs.",
          },
          // {
          //   label: "Perfect your arc",
          //   description: "Learn how to hit the sweet spot between height and accuracy.",
          // },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-5 text-left shadow-[0_18px_50px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-orange-400/50 hover:bg-slate-900/95"
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-orange-300">
              {item.label}
            </p>
            <p className="mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-slate-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
