import React, { useState } from "react";
import "./App.css";
import Form from "./Form/Form.tsx";
import Feedback from "./Feedback.tsx";
import Home from "./Home.tsx";
import Overlay from "./Overlay.tsx";
import FormHome from "./Form/FormHome.tsx";
import ArcHome from "./Arc/ArcHome.tsx";
import Arc from "./Arc/Arc.tsx";
import HomeLogo from "./HomeLogo.tsx";
import HoverSettings from "./HoverSettings.tsx";
import BackgroundLayout from "./BackgroundLayout.tsx";
import FormLive from "./Form/FormLive.tsx";
import Playmaking from "./PlayMaking/Playmaking.tsx";
import BottomBar from "./BottomBar.tsx";
import Demo from "./Demo.tsx";

export default function App() {
  const [active, setActive] = useState("Home");
  const [demo, setDemo] = useState(false);
  const [videoURL, setVideoURL] = useState<string>("");
  const [contextList, setContextList] = useState<string[]>([]);

  return (
    <BackgroundLayout>
      <div>
        <div className="fixed left-3 top-0 z-50 text-orange-500">
          <HoverSettings name="Home">
            <HomeLogo active={active} setActive={setActive} />
          </HoverSettings>
        </div>
        <div className="fixed right-10 top-5 z-50 text-orange-500">
          <button
            className="text-lg font-bold cursor-pointer text-slate-800 dark:text-slate-100 bg-slate-200
             dark:bg-slate-700 px-3 py-1 rounded-lg transition-all ease-in-out duration-300 hover:bg-slate-300
              dark:hover:bg-slate-600 hover:scale-110 active:scale-95 transform-gpu"
            onClick={() => setDemo(true)}
          >
            <strong>Demo</strong>
          </button>
        </div>

        <div
          className="box-border flex min-h-dvh items-center justify-center text-white"
          style={{ paddingBottom: "var(--bottom-bar-reserved-space)" }}
        >
          <main className="mx-auto w-full p-4">
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
              />
            ) : active === "Arc" ? (
              <Arc videoUrl={videoURL} />
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
        <Demo demo={demo} setDemo={setDemo} />
      </div>
    </BackgroundLayout>
  );
}
