import { useEffect, useState } from "react";
import useGemini from "./useGemini";

interface Props {
  contextList: string[];
  setContextList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Feedback({ contextList, setContextList }: Props) {
  const { mutation } = useGemini();
  const [feedback, setFeedback] = useState({
    ankle: "Analyzing...",
    knees: "Analyzing...",
    arm: "Analyzing...",
    futureSteps: "Analyzing...",
  });
  const [gaveFeedback, setGaveFeedback] = useState(false);

  useEffect(() => {
    console.log("Inside of useEffect with this context:", contextList);
    if (!mutation) return;
    if (gaveFeedback) return;
    if (contextList.length === 0) return;

    mutation.mutate({
      text: "Give me feedback on my basketball shot based on the following context:",
      list: contextList,
    });

    setGaveFeedback(true);
  }, [contextList]);

  useEffect(() => {
    if (!mutation) return;

    if (mutation.status === "success" && mutation.data) {
      setFeedback(JSON.parse(mutation.data.resText));
      console.log("Gemini response:", mutation.data.resText);
      setContextList([]);
    }

    if (mutation.status === "error") {
      alert(
        "An error occurred while fetching Gemini feedback: " + mutation.error,
      );
    }
  }, [mutation?.status]);

  return (
    <div>
      <h1>Feedback</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="border p-2">Ankle</th>
            <th className="border p-2">Knees</th>
            <th className="border p-2">Arm</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border p-4">{feedback.ankle}</td>
            <td className="border p-4">{feedback.knees}</td>
            <td className="border p-4">{feedback.arm}</td>
          </tr>
        </tbody>
      </table>
      <div className="my-4">
        {" "}
        {/* Adds margin for spacing */}
        <hr className="border-white border-t-2 w-full" />{" "}
        {/* Sets white color, top border width, and full width */}
      </div>
      <h2>Future Steps</h2>
      <p>{feedback.futureSteps}</p>
    </div>
  );
}
