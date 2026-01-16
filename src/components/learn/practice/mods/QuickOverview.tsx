import { usePractice } from "@/src/hooks/usePractice";
import { useEffect, useState } from "react";

import { useLanguageContext } from "../../../common/LanguageProvider";
import WordCard from "../../WordCard";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

export default function QuickOverview({ onEndCurrentSet }: PracticeModeChildProps) {
  const { words } = usePractice();
  const { text } = useLanguageContext();

  const [hasFinished, setHasFinished] = useState(false);

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!hasFinished && index >= words.length && words.length > 0) {
      setHasFinished(true);

      const totalReviewed = acceptedCount + rejectedCount;
      const percentage = totalReviewed > 0 ? Math.round((acceptedCount / totalReviewed) * 100) : 0;

      const endMessage = text("practice_quick_overview_end_message", {
        accepted: acceptedCount,
        totalReviewed,
        percentage,
      });
      onEndCurrentSet?.(endMessage);
    }
  }, [index, words.length, onEndCurrentSet, hasFinished, acceptedCount, rejectedCount, text]);

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

  return (
    <WordCard
      word={words[index]}
      accept={accept}
      acceptBtnName={text("practice_quick_overview_accept")}
      reject={reject}
      rejectBtnName={text("practice_quick_overview_reject")}
    />
  );
}
