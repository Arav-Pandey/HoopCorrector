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

export type FreePath = {
  points: Point[];
  pass: boolean;
  isLatest: boolean;
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
  // pass: boolean;
  onLatestPass: () => boolean;
}

interface LineStartProps {
  children: React.ReactNode;
}

function pointsToSmoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
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

export default function LineDrawerCurve({
  children,
  reset,
  removeLines,
  setRemoveLines,
  onLatestPass,
}: LineDrawerProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [paths, setPaths] = useState<FreePath[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const drawingRef = useRef(false);

  useEffect(() => {
    if (reset) {
      setPaths([]);
      setCurrentPath([]);
      setDrawing(false);
      drawingRef.current = false;
    }
    if (removeLines) {
      setPaths((prev) => prev.slice(0, -1));
      setRemoveLines(false);
    }
  }, [reset, removeLines]);

  function startLineFromElement(element: HTMLDivElement) {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const point: Point = {
      x: elementRect.left - boardRect.left + elementRect.width / 2,
      y: elementRect.top - boardRect.top + elementRect.height / 2,
    };

    setCurrentPath([point]);
    setDrawing(true);
    drawingRef.current = true;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawingRef.current || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const point: Point = {
      x: e.clientX - boardRect.left,
      y: e.clientY - boardRect.top,
    };

    setCurrentPath((prev) => [...prev, point]);
  }
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawingRef.current || currentPath.length < 2) return;

    const latestPass = onLatestPass();

    setPaths((prev) => [
      ...prev,
      { points: currentPath, pass: latestPass, isLatest: true },
    ]);
    setCurrentPath([]);
    setDrawing(false);
    drawingRef.current = false;
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawingRef.current || currentPath.length < 2) {
      setDrawing(false);
      drawingRef.current = false;
      setCurrentPath([]);
      return;
    }

    setPaths((prev) => [
      ...prev,
      { points: currentPath, pass: false, isLatest: true },
    ]);
    setCurrentPath([]);
    setDrawing(false);
    drawingRef.current = false;
  }

  return (
    <LineDrawerContext.Provider value={{ startLineFromElement }}>
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        className="relative"
      >
        {children}

        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {paths.map((path, index) => {
            path.isLatest = index === paths.length - 1;
            return (
              <path
                key={index}
                d={pointsToSmoothPath(path.points)}
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={path.pass ? "8 6" : "0"}
              />
            );
          })}

          {drawing && currentPath.length >= 2 && (
            <path
              d={pointsToSmoothPath(currentPath)}
              stroke="orange"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
      </div>
    </LineDrawerContext.Provider>
  );
}
