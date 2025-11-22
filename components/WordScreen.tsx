import { Word } from "@/model/entity/types";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WordCard from "./WordCard";

export default function WordScreen({
  words,
  accept,
  reject,
}: {
  words: Word[];
  accept: (word: Word) => void;
  reject: (word: Word) => void;
}) {

  const handleKnow = () => {
      accept(words[0]);
  };

  const handleDontKnow = () => {
      reject(words[0]);
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
      word={words[0]}
      onKnow={handleKnow}
      onDontKnow={handleDontKnow}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
