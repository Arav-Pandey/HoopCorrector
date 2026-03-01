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
import GeminiButton from "./GeminiButton.tsx";

export default function App() {
  const [active, setActive] = React.useState("Home");
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

        <div className="min-h-screen flex items-center justify-center text-white">
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
            ) : (
              <Overlay setActive={setActive} />
            )}
          </main>
        </div>
      </div>
    </BackgroundLayout>
  );
}
