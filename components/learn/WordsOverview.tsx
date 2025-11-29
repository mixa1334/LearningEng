import { useVocabulary } from "@/hooks/useVocabulary";
import { Word } from "@/model/entity/types";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import WordCard from "./WordCard";

interface WordsOverviewProps {
  readonly onlyUserAddedWords: boolean;
}

export default function WordsOverview({
  onlyUserAddedWords,
}: WordsOverviewProps) {
  const theme = useTheme();

  const { words, preloadedWords } = useVocabulary();
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [total, setTotal] = useState(0);
  const [wordToReview, setWordToReview] = useState<Word[]>([]);

  useEffect(() => {
    if (onlyUserAddedWords) {
      setWordToReview(words);
    } else {
      setWordToReview([...words, ...preloadedWords]);
    }
    reset();
  }, [words, preloadedWords, onlyUserAddedWords]);

  const reset = () => {
    setAccepted(0);
    setRejected(0);
    setTotal(0);
  };

  const accept = () => {
    setAccepted(accepted + 1);
    updateTotalCounter();
  };

  const reject = () => {
    setRejected(rejected + 1);
    updateTotalCounter();
  };

  const updateTotalCounter = () => setTotal(total + 1);

  if (total >= wordToReview.length) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
          Percentage of words you remembered -{" "}
          {Math.round((accepted / total) * 100)}%
        </Text>
        <Button mode="contained-tonal" onPress={reset}>
          Review again
        </Button>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.content,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>
        Known: {accepted}
      </Text>
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>
        Not known: {rejected}
      </Text>
      <Text style={[styles.text, { color: theme.colors.onSurface }]}>
        Total: {total}
      </Text>
      <WordCard
        word={wordToReview[total]}
        accept={accept}
        acceptBtnName="Know"
        reject={reject}
        rejectBtnName="Don't know"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    width: "100%",
    alignSelf: "stretch",
    paddingHorizontal: 16,
    paddingVertical: 8,
    // no flex, no centering here so it expands "normally" in the parent section
  },
});
