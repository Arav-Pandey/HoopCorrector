import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Point = {
  x: number;
  y: number;
};

type Line = {
  start: Point;
  end: Point;
};

type LineDrawerContextType = {
  startLineFromElement: (element: HTMLDivElement) => void;
};

const LineDrawerContext = createContext<LineDrawerContextType | null>(null);

interface LineDrawerProps {
  children: React.ReactNode;
  reset: boolean;
  removeLines: boolean;
  setRemoveLines: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LineStartProps {
  children: React.ReactNode;
}

export function LineStart({ children }: LineStartProps) {
  const context = useContext(LineDrawerContext);
  const markerRef = useRef<HTMLDivElement | null>(null);

  if (!context) {
    throw new Error("LineStart must be used inside LineDrawer");
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    if (!markerRef.current) return;
    context?.startLineFromElement(markerRef.current);
  }

  return (
    <div
      ref={markerRef}
      onDoubleClick={handleDoubleClick}
      className="inline-flex items-center justify-center"
    >
      {children}
    </div>
  );
}

export default function LineDrawer({
  children,
  reset,
  removeLines,
  setRemoveLines,
}: LineDrawerProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewEnd, setPreviewEnd] = useState<Point | null>(null);

  useEffect(() => {
    if (reset) {
      // console.log("Resetting lines...");
      setLines([]);
    }
    if (removeLines) {
      // console.log("Removing line...");
      setLines((prev) => prev.slice(0, -1));
      setRemoveLines(false);
    }
  }, [reset, removeLines]);

  function startLineFromElement(element: HTMLDivElement) {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const point = {
      x: elementRect.left - boardRect.left + elementRect.width / 2,
      y: elementRect.top - boardRect.top + elementRect.height / 2,
    };

    setStartPoint(point);
    setPreviewEnd(point);
    setDrawing(true);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawing || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();

    setPreviewEnd({
      x: e.clientX - boardRect.left,
      y: e.clientY - boardRect.top,
    });
  }

  function handleBoardClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawing || !startPoint || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();

    const endPoint = {
      x: e.clientX - boardRect.left,
      y: e.clientY - boardRect.top,
    };

    setLines((prev) => [
      ...prev,
      {
        start: startPoint,
        end: endPoint,
      },
    ]);

    setDrawing(false);
    setStartPoint(null);
    setPreviewEnd(null);
  }

  return (
    <LineDrawerContext.Provider value={{ startLineFromElement }}>
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onClick={handleBoardClick}
        className="relative"
      >
        {children}

        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="0"
            />
          ))}

          {drawing && startPoint && previewEnd && (
            <line
              x1={startPoint.x}
              y1={startPoint.y}
              x2={previewEnd.x}
              y2={previewEnd.y}
              stroke="orange"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </LineDrawerContext.Provider>
  );
}
