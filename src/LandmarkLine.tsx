import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import React from "react";

interface LandmarkLineProps {
  a: NormalizedLandmark;
  b: NormalizedLandmark;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

const LandmarkLine: React.FC<LandmarkLineProps> = ({
  a,
  b,
  width = 640,
  height = 480,
  strokeColor = "#00FF00",
  strokeWidth = 2,
}) => {
  // Denormalize: multiply by canvas dimensions
  const x1 = a.x * width;
  const y1 = a.y * height;
  const x2 = b.x * width;
  const y2 = b.y * height;

  return (
    <svg width={width} height={height} style={{ background: "#111" }}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Optional: render the landmark points */}
      <circle cx={x1} cy={y1} r={4} fill={strokeColor} />
      <circle cx={x2} cy={y2} r={4} fill={strokeColor} />
    </svg>
  );
};

export default LandmarkLine;
