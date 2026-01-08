import { usePractice } from "@/src/hooks/usePractice";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import WordCard from "../../WordCard";
import { PracticeModeChildProps } from "../PracticeModeWrapper";

export default function WordsOverview({ onEndCurrentSet }: PracticeModeChildProps) {
  const { words } = usePractice();

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [index, setIndex] = useState(0);

  const accept = () => {
    setAcceptedCount((prev) => {
      const nextAccepted = prev + 1;
      updateIndex(nextAccepted, rejectedCount);
      return nextAccepted;
    });
  };

  const reject = () => {
    setRejectedCount((prev) => {
      const nextRejected = prev + 1;
      updateIndex(acceptedCount, nextRejected);
      return nextRejected;
    });
  };

  const generateEndMessage = (accepted: number, rejected: number): string => {
    const totalReviewed = accepted + rejected;
    let percentage = 0;
    if (totalReviewed !== 0) {
      percentage = Math.round((accepted / totalReviewed) * 100);
    }
    return `You remembered ${accepted} of ${totalReviewed} words (${percentage}%)`;
  };

  function updateIndex(accepted: number, rejected: number) {
    setIndex((prevIndex) => {
      let newIndex = prevIndex + 1;
      if (newIndex === words.length) {
        newIndex = 0;
        onEndCurrentSet?.(generateEndMessage(accepted, rejected));
      }
      return newIndex;  
    });
  }

  return (
    <View style={styles.container}>
      <WordCard word={words[index]} accept={accept} acceptBtnName="Know" reject={reject} rejectBtnName="Don't know" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
