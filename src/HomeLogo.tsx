import { GoHome, GoHomeFill } from "react-icons/go";

interface Props {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function HomeLogo({ active, setActive }: Props) {
  return (
    <button
      onClick={() => (active !== "Home" ? setActive("Home") : null)}
      className=" mt-1 cursor-pointer relative hover:bg-gray-200 rounded-2xl transition-colors px-1.5 py-1.5 bg-gray-100"
    >
      {active === "Home" ? <GoHomeFill size={30} /> : <GoHome size={30} />}
    </button>
  );
}
