import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Draggable({ children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (!dragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    function handleUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMove); // Listens from the whole window instead of just the div
    window.addEventListener("mouseup", handleUp);

    return () => {
      // Stops when user stops dragging
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  return (
    <div ref={containerRef} className=" inset-0 pointer-events-none relative">
      <div
        onMouseDown={() => setDragging(true)}
        className="absolute cursor-grab select-none text-3xl font-bold pointer-events-auto leading-none"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
