import Brain from "./assets/Brain.png";
import DeepBrain from "./assets/DeepBrain.png";
import FormLive from "../src/Form/FormLive";
import Form from "../src/Form/Form";
import Home from "./Home";
import Arc from "./Arc/Arc";
import { GiBasketballBasket } from "react-icons/gi";

type Tab = "Home" | "FormLive" | "Form" | "Arc";

interface Page {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 580,
    margin: "0 auto",
    background: "transparent",
    overflow: "hidden",
    zIndex: 1000,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  bottomBar: {
    height: 110,
    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.8) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(248, 113, 113, 0.1)",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "12px 12px",
    flexShrink: 0,
    boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    width: "100%",
  },
  navButton: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px 4px",
    position: "relative",
    border: "none",
    background: "none",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transition: "all 0.3s ease",
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    objectFit: "contain",
    cursor: "pointer",
  },
  navLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 28,
    height: 3,
    background: "linear-gradient(90deg, #F97316 0%, #FB923C 100%)",
    borderRadius: 99,
    boxShadow: "0 0 12px rgba(249, 115, 22, 0.6)",
  },
  navImage: {
    width: 56,
    height: 56,
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
  const PAGES: Page[] = [
    {
      id: "FormLive",
      label: "FormLive",
      icon: <img src={Brain} alt="Brain" style={styles.navImage} />,
      content: <FormLive />,
    },
    {
      id: "Home",
      label: "Home",
      icon: <HomeIcon />,
      content: <Home setActive={setActive} />,
    },
    {
      id: "Form",
      label: "Deep Form Analysis",
      icon: <img src={DeepBrain} alt="DeepBrain" style={styles.navImage} />,
      content: (
        <Form
          setActive={setActive}
          videoURL={videoURL}
          contextList={contextList}
          setContextList={setContextList}
        />
      ),
    },
    {
      id: "Arc",
      label: "Arc Analysis",
      icon: <GiBasketballBasket size={42} />,
      content: <Arc videoUrl={videoURL} />,
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
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(249, 115, 22, 0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <span
                style={{
                  ...styles.navIcon,
                  color: isActive ? "#F97316" : "#9CA3AF",
                  transform: isActive ? "translateY(-2px) scale(1.1)" : "translateY(0) scale(1)",
                  transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {page.icon}
              </span>
              <strong
                style={{
                  ...styles.navLabel,
                  color: isActive ? "#F97316" : "#9CA3AF",
                  transition: "color 0.2s ease",
                  textShadow: isActive ? "0 0 8px rgba(249, 115, 22, 0.3)" : "none",
                }}
              >
                {page.label}
              </strong>
              {/* Orange gradient underline indicator */}
              <span
                style={{
                  ...styles.indicator,
                  transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})`,
                  transition:
                    "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
