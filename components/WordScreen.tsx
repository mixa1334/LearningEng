import { Word } from "@/model/entity/types";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WordCard from "./WordCard";

export default function WordScreen({ words }: { words: Word[] }) {
  const [queue, setQueue] = useState<Word[]>(words);
  const [index, setIndex] = useState(0);

  const handleKnow = () => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
    if (index >= newQueue.length) setIndex(0);
  };

  const handleDontKnow = () => {
    const word = queue[index];
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    newQueue.push(word);
    setQueue(newQueue);
    if (index >= newQueue.length) setIndex(0);
  };

  if (queue.length === 0) {
    return (
      <View style={styles.center}>
        <Text>You completed tasks, come back later!</Text>
      </View>
    );
  }

  return (
    <WordCard
      word={queue[index]}
      onKnow={handleKnow}
      onDontKnow={handleDontKnow}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
