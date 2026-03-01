interface Props {
  setActive: React.Dispatch<React.SetStateAction<string>>;
}
import Basketball from "./assets/Basketball.png";

export default function Home({ setActive }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">HoopCorrector</h1>
      <p className="text-lg mb-6 w-[80%] mx-auto leading-normal font-[Inter]">
        This website helps basketball players improve their shooting by
        analyzing either their shooting <strong>Form</strong> or their{" "}
      </p>
      <ul className="list-disc text-lg mb-6 w-[80%] mx-auto leading-normal pl-6 font-[Inter] space-y-4">
        <li>
          To begin, simply click <strong>“Get Started.”</strong>
        </li>
        <li>
          You’ll then choose whether you want to work on your{" "}
          <strong>Form</strong> or your <strong>Arc</strong>.
        </li>
        <li>
          If you select form, the system analyzes your body positioning and
          shooting mechanics to identify areas that could be improved, such as
          alignment, balance, and release technique.
        </li>
        <li>
          If you choose arc, the system tracks the basketball’s trajectory to
          evaluate the height and shape of your shot, helping you understand
          whether your arc is too flat or too high.
        </li>
        <li>
          After analyzing your shot, the website provides detailed feedback so
          you can make adjustments and develop a more consistent, effective
          shooting motion.
        </li>
      </ul>
      <h1 className="font-bold text-3xl mb-4">Have Fun!</h1>
      <button
        className="cursor-pointer bg-none border-none outline-none p-0"
        onClick={() => setActive("Record")}
      >
        <img
          src={Basketball}
          alt="Get Started"
          className="w-27 h-20 transform hover:scale-110 transition duration-300"
        />
      </button>
    </div>
  );
}
