import { useLearnUtil } from "@/hooks/useLearn";
import { Word } from "@/model/entity/types";
import React from "react";
import WordScreen from "./WordScreen";

interface LearningContentProps {
  readonly isLearnTab: boolean;
  readonly wordsToLearn: Word[];
  readonly wordsToReview: Word[];
}

export default function LearningContent({
  isLearnTab,
  wordsToLearn,
  wordsToReview,
}: LearningContentProps) {
  const {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  } = useLearnUtil();

  const words = isLearnTab ? wordsToLearn : wordsToReview;
  const accept = isLearnTab ? markWordCompletelyLearned : markWordReviewed;
  const reject = isLearnTab ? startLearnNewWord : markWordNotReviewed;
  const acceptLabel = isLearnTab ? "I know" : "I remember";
  const rejectLabel = isLearnTab ? "Start learn" : "Show late";

  return (
    <WordScreen
      words={words}
      accept={accept}
      acceptBtnName={acceptLabel}
      reject={reject}
      rejectBtnName={rejectLabel}
    />
  );
}


