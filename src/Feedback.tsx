import { useEffect, useState } from "react";
import useGemini from "./useGemini";

interface Props {
  contextList: string[];
  setContextList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Feedback({ contextList, setContextList }: Props) {
  const { mutation } = useGemini();
  const [feedback, setFeedback] = useState("");
  const [gaveFeedback, setGaveFeedback] = useState(false);

  useEffect(() => {
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
      setFeedback(mutation.data.resText);
      setContextList([]);
    }

    if (mutation.status === "error") {
      alert(
        "An error occurred while fetching Gemini feedback: " + mutation.error,
      );
    }
    if (mutation.status === "pending") {
      setFeedback("Gemini is analyzing your shot...");
    }
  }, [mutation?.status]);

  return (
    <div>
      <h1>Feedback</h1>
      <p>Gemini Feedback: {feedback}</p>
    </div>
  );
}
