import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";

interface Props {
  demo: boolean;
  setDemo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Demo({ demo, setDemo }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (demo) {
      // Small delay lets the element mount before the transition fires
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [demo]);

  if (!demo) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <p style={{ color: "#fff", fontSize: 48, fontWeight: 700, margin: 0 }}>
        Demo Coming Soon!
      </p>
      <p
        onClick={() => setDemo(false)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <FaWindowClose size={40} />
      </p>
    </div>
  );
}
