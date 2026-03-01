import Logo from "./assets/Logo.png";

interface Props {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function HomeLogo({ active, setActive }: Props) {
  return (
    <button
      onClick={() => (active !== "Home" ? setActive("Home") : null)}
      className=" mt-1 cursor-pointer relative rounded-2xl transition-colors px-1.5 py-1.5"
    >
      <img src={Logo} alt="Home Page" className="w-20 h-20" />
    </button>
  );
}
