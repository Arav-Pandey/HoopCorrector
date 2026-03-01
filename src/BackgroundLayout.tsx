import { useState } from "react";
import court from "./assets/BasketballCourt.png";

export default function BackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="relative min-h-screen" onMouseMove={handleMouseMove}>
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 bg-black">
        {/* court background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${court})` }}
        />

        {/* glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(
              500px circle at ${pos.x}px ${pos.y}px,
              rgba(255,140,0,0.2),
              transparent 40%
            )`,
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
