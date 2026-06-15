import { useState } from "react";
import "./App.css";
import Form from "./Form/Form.tsx";
import Feedback from "./Feedback.tsx";
import Home from "./Home.tsx";
import Overlay from "./Overlay.tsx";
import FormHome from "./Form/FormHome.tsx";
import ArcHome from "./Arc/ArcHome.tsx";
import Arc from "./Arc/Arc.tsx";
import BackgroundLayout from "./BackgroundLayout.tsx";
import FormLive from "./Form/FormLive.tsx";
import Playmaking from "./PlayMaking/Playmaking.tsx";
import BottomBar from "./BottomBar.tsx";
import Demo from "./Demo.tsx";

export default function App() {
  const [active, setActive] = useState("Home");
  const [videoURL, setVideoURL] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [contextList, setContextList] = useState<string[]>([]);
  const [showDemo, setShowDemo] = useState(false);
  const [demoExiting, setDemoExiting] = useState(false);

  const handleClosedemo = () => {
    setDemoExiting(true);
    setTimeout(() => {
      setShowDemo(false);
      setDemoExiting(false);
    }, 400); // Match animation duration
  };

  return (
    <BackgroundLayout>
      <div>
        <div className="min-h-screen w-full text-white pb-32 sm:pb-40" style={{ paddingBottom: "calc(14rem + env(safe-area-inset-bottom, 0px))" }}>
          <main className="w-full px-4 sm:px-0">
            {active === "Form" ? (
              <Form
                setActive={setActive}
                videoURL={videoURL}
                setContextList={setContextList}
                contextList={contextList}
              />
            ) : active === "Home" ? (
              <Home setActive={setActive} />
            ) : active === "Feedback" ? (
              <Feedback
                contextList={contextList}
                setContextList={setContextList}
              />
            ) : active === "FormHome" ? (
              <FormHome
                setActive={setActive}
                setVideoURL={setVideoURL}
                videoURL={videoURL}
              />
            ) : active === "ArcHome" ? (
              <ArcHome
                setActive={setActive}
                setVideoURL={setVideoURL}
                videoURL={videoURL}
                setVideoFile={setVideoFile}
              />
            ) : active === "Arc" ? (
              <Arc videoUrl={videoURL} videoFile={videoFile} />
            ) : active === "FormLive" ? (
              <FormLive />
            ) : active === "Playmaking" ? (
              <Playmaking />
            ) : (
              <Overlay setActive={setActive} />
            )}
          </main>
        </div>
        <BottomBar
          active={active}
          setActive={setActive}
          videoURL={videoURL}
          contextList={contextList}
          setContextList={setContextList}
        />
      </div>

      {/* Demo Button - Fixed on top right */}
      <button
        onClick={() => setShowDemo(true)}
        className="fixed top-3 sm:top-4 right-3 sm:right-4 z-40 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 font-semibold rounded-lg border border-orange-500/40 hover:border-orange-400/60 transition-all backdrop-blur-md active:scale-95"
      >
        Demo
      </button>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50">
          <div
            className={`h-full w-full overflow-y-auto ${
              demoExiting ? "demo-modal-exit" : "demo-modal-enter"
            }`}
          >
            <Demo onClose={handleClosedemo} />
          </div>
        </div>
      )}
    </BackgroundLayout>
  );
}
