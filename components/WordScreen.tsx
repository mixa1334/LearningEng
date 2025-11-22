import { Word } from "@/model/entity/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
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
  const theme = useTheme();

  const handleKnow = () => {
    accept(words[0]);
  };

  const handleDontKnow = () => {
    reject(words[0]);
  };

  if (words.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
          You completed tasks, come back later!
        </Text>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

