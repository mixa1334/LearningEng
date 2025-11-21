import { Word } from "@/model/entity/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WordCard from "./WordCard";

export default function WordScreen({
  words,
  learnedCallback,
}: {
  words: Word[];
  learnedCallback: (word: Word) => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [words]);

  const handleKnow = () => {
    learnedCallback(words[index]);
    if (index >= words.length) setIndex(0);
  };

  const handleDontKnow = () => {
    setIndex(index + 1);
    if (index >= words.length) setIndex(0);
  };

  if (words.length === 0) {
    return (
      <View style={styles.center}>
        <Text>You completed tasks, come back later!</Text>
      </View>
    );
  }

  return (
    <WordCard
      word={words[index]}
      onKnow={handleKnow}
      onDontKnow={handleDontKnow}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
