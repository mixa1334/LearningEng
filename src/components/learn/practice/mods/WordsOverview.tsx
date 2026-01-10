import { usePractice } from "@/src/hooks/usePractice";
import { useEffect, useState } from "react";
import WordCard from "../../WordCard";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

export default function WordsOverview({ onEndCurrentSet }: PracticeModeChildProps) {
  const { words } = usePractice();

  const [hasFinished, setHasFinished] = useState(false);

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!hasFinished && index >= words.length && words.length > 0) {
      setHasFinished(true);

      const totalReviewed = acceptedCount + rejectedCount;
      const percentage = totalReviewed > 0 ? Math.round((acceptedCount / totalReviewed) * 100) : 0;

      const endMessage = `You remembered ${acceptedCount} of ${totalReviewed} words (${percentage}%)`;
      onEndCurrentSet?.(endMessage);
    }
  }, [index, words.length, onEndCurrentSet, hasFinished, acceptedCount, rejectedCount]);

  const accept = () => {
    setAcceptedCount((prev) => {
      const nextAccepted = prev + 1;
      updateIndex();
      return nextAccepted;
    });
  };

  const reject = () => {
    setRejectedCount((prev) => {
      const nextRejected = prev + 1;
      updateIndex();
      return nextRejected;
    });
  };

  function updateIndex() {
    setIndex((prevIndex) => prevIndex + 1);
  }

  if (index >= words.length || hasFinished) return null;

  return <WordCard word={words[index]} accept={accept} acceptBtnName="Know" reject={reject} rejectBtnName="Don't know" />;
}
