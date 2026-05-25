import { useEffect, useRef } from "react";

interface Props {
  info: boolean;
  setInfo: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  children: React.ReactNode;
}

export default function InfoTop({ info, setInfo, text, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!info) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setInfo(false);
      }
    };

    // Timeout prevents the same click that opened it from closing it immediately
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [info, setInfo]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      {info && (
        <>
          {/* Scrollable bubble */}
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1e293b",
              color: "#f8fafc",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: "normal",
              wordBreak: "break-word",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              zIndex: 50,
              width: 320,
              maxHeight: 130,
              overflowY: "auto",
              // pointerEvents removed ← lets scrolling work
            }}
          >
            <p style={{ margin: 0 }}>{text}</p>
          </div>

          {/* Triangle sits outside the scrollable div so overflow doesn't clip it */}
          <span
            style={{
              position: "absolute",
              bottom: "calc(100% + 5px)", // sits just below the bubble
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "7px solid #1e293b",
              zIndex: 51,
            }}
          />
        </>
      )}

      {children}
    </div>
  );
}
