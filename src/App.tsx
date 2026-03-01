import React, { useState } from "react";
import "./App.css";
import Form from "./Form.tsx";
import Feedback from "./Feedback.tsx";
import Home from "./Home.tsx";
import Overlay from "./Overlay.tsx";
import FormHome from "./FormHome.tsx";
import ArcHome from "./ArcHome.tsx";
import Arc from "./Arc.tsx";
import HomeLogo from "./HomeLogo.tsx";
import HoverSettings from "./HoverSettings.tsx";

export default function App() {
  const [active, setActive] = React.useState("Home");
  const [videoURL, setVideoURL] = useState<string>("");
  const [contextList, setContextList] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="absolute left-10 top-5">
        <HoverSettings name="Home">
          <HomeLogo active={active} setActive={setActive} />
        </HoverSettings>
      </div>

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
          <Feedback contextList={contextList} setContextList={setContextList} />
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
        ) : (
          <Overlay setActive={setActive} />
        )}
      </main>
    </div>
  );
}
