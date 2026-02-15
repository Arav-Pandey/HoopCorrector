import React from "react";
import { FaHome } from "react-icons/fa";
import { IoCameraSharp, IoChatboxEllipses } from "react-icons/io5";
import "./App.css";
import BottomBar from "./BottomBar.tsx";
import Camera from "./Camera.tsx";
import Feedback from "./Feedback.tsx";
import Home from "./Home.tsx";

export default function App() {
  const [active, setActive] = React.useState("Home");

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <main className="mx-auto max-w-md p-4">
        <h1 className="text-xl font-semibold">Page: {active}</h1>
        {active === "Camera" ? (
          <Camera setActive={setActive} />
        ) : active === "Home" ? (
          <Home />
        ) : (
          <Feedback />
        )}
      </main>

      <BottomBar
        activeId={active}
        items={[
          {
            id: "Camera",
            label: "Camera",
            onClick: () => setActive("Camera"),
            icon: <IoCameraSharp size={20} />,
          },
          {
            id: "Home",
            label: "Home",
            onClick: () => setActive("Home"),
            icon: <FaHome size={20} />,
          },
          {
            id: "Feedback",
            label: "Feedback",
            onClick: () => setActive("Feedback"),
            icon: <IoChatboxEllipses size={20} />,
          },
        ]}
      />
    </div>
  );
}
