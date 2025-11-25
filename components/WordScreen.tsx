import { Word } from "@/model/entity/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import WordCard from "./WordCard";

export default function WordScreen({
  words,
  accept,
  acceptBtnName,
  reject,
  rejectBtnName
}: {
  words: Word[];
  accept: (word: Word) => void;
  acceptBtnName: string;
  reject: (word: Word) => void;
  rejectBtnName: string;
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
      accept={handleKnow}
      acceptBtnName={acceptBtnName}
      reject={handleDontKnow}
      rejectBtnName={rejectBtnName}
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

