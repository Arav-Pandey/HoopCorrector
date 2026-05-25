import Brain from "./assets/Brain.png";
import DeepBrain from "./assets/DeepBrain.png";
import FormLive from "../src/Form/FormLive";
import Form from "../src/Form/Form";
import Home from "./Home";
import { useState } from "react";
import BrainOrange from "./assets/Brain_Orange.png";
import DeepBrainOrange from "./assets/Deep_Brain_Orange.png";

type Tab = "Home" | "FormLive" | "Form";

interface Page {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  iconOrange: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    position: "fixed",
    bottom: "calc(var(--bottom-bar-gap) + env(safe-area-inset-bottom, 0px))",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(100% - 1rem, 580px)",
    maxWidth: 580,
    margin: "0 auto",
    background: "transparent",
    overflow: "hidden",
    zIndex: 1000,
  },
  pageArea: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    color: "#6B7280",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    margin: 0,
  },
  bottomBar: {
    height: "var(--bottom-bar-height)",
    background: "rgba(15, 23, 42, 0.65)", // Transparent dark slate (or use #000000 at 0.65)
    backdropFilter: "blur(16px)", // Slightly stronger blur for dark mode contrast
    WebkitBackdropFilter: "blur(16px)", // Safari support
    borderTop: "1px solid rgba(255, 255, 255, 0.08)", // Subtle light border edge
    borderRadius: "20px 20px 20px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "0 8px",
    flexShrink: 0,
    boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)", // Darker, deep shadow
    width: "100%",
  },
  navButton: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: "8px 0",
    position: "relative",
    border: "none",
    background: "none",
    cursor: "default",
    WebkitTapHighlightColor: "transparent",
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 62,
    height: 62,
    objectFit: "contain",
  },
  navLabel: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
  indicator: {
    position: "absolute",
    bottom: 2,
    left: "50%",
    width: 24,
    height: 2.5,
    background: "#F97316",
    borderRadius: 99,
  },
  navOrangeIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 82,
    height: 82,
    objectFit: "contain",
  },
};

const HomeIcon = () => (
  <svg
    width="42"
    height="42"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

interface Props {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  videoURL: string; // recorded video URL
  contextList: string[];
  setContextList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function BottomBar({
  active,
  setActive,
  videoURL,
  contextList,
  setContextList,
}: Props) {
  const getColor = (id: string) => {
    if (active === id) return "#F97316"; // active → solid orange
    return "#9CA3AF"; // default → gray
  };
  const PAGES: Page[] = [
    {
      id: "FormLive",
      label: "FormLive",
      icon: <img src={Brain} alt="Brain" style={styles.navIcon} />,
      content: <FormLive />,
      iconOrange: (
        <img
          src={BrainOrange}
          alt="Orange_Brain"
          style={styles.navOrangeIcon}
        />
      ),
    },
    {
      id: "Home",
      label: "Home",
      icon: <HomeIcon />,
      content: <Home setActive={setActive} />,
      iconOrange: <HomeIcon />, // Home icon stays the same on hover/active
    },
    {
      id: "Form",
      label: "Deep Form Analysis",
      icon: <img src={DeepBrain} alt="DeepBrain" style={styles.navIcon} />,
      content: (
        <Form
          setActive={setActive}
          videoURL={videoURL}
          contextList={contextList}
          setContextList={setContextList}
        />
      ),
      iconOrange: (
        <img
          src={DeepBrainOrange}
          alt="Orange_DeepBrain"
          style={styles.navOrangeIcon}
        />
      ),
    },
  ];

  return (
    <div style={styles.shell}>
      {/* Bottom bar */}
      <nav style={styles.bottomBar}>
        {PAGES.map((page) => {
          const isActive = page.id === active;
          return (
            <button
              key={page.id}
              onClick={() => setActive(page.id)}
              style={styles.navButton}
              aria-label={page.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                style={{
                  ...styles.navIcon,
                  color: getColor(page.id),
                  transform: isActive ? "translateY(-1px)" : "translateY(0)",
                  transition: "color 0.18s ease, transform 0.18s ease",
                }}
              >
                {getColor(page.id) === "#F97316" ? page.iconOrange : page.icon}
              </span>
              <strong
                style={{
                  ...styles.navLabel,
                  color: getColor(page.id),
                  transition: "color 0.18s ease",
                }}
              >
                {page.label}
              </strong>
              {/* Orange underline indicator */}
              <span
                style={{
                  ...styles.indicator,
                  transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})`,
                  transition:
                    "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
