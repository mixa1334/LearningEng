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
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
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
    setIndex(0);
    setEnded(false);
  };

  const accept = () => {
    setAccepted(accepted + 1);
    updateTotalCounter();
  };

  const reject = () => {
    setRejected(rejected + 1);
    updateTotalCounter();
  };

  const updateTotalCounter = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    if (newIndex >= wordToReview.length) {
      end();
    }
  };

  const end = () => setEnded(true);

  const calculatePercentage = () => {
    if (index === 0) return 0;
    return Math.round((accepted / index) * 100);
  };

  if (wordToReview.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
          No words to review
        </Text>
      </View>
    );
  }

  if (ended) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
          Percentage of words you remembered - {calculatePercentage()}%
        </Text>
        <Button
          mode="contained-tonal"
          onPress={reset}
          style={styles.reviewButton}
        >
          Review again
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statsContainer}>
        <Text style={[styles.text, { color: theme.colors.onSurface }]}>
          Accepted: {accepted}
        </Text>
        <Text style={[styles.text, { color: theme.colors.onSurface }]}>
          Rejected: {rejected}
        </Text>
        <Text style={[styles.text, { color: theme.colors.onSurface }]}>
          Total: {index}
        </Text>
      </View>
      <Button mode="contained-tonal" onPress={end} style={styles.reviewButton}>
        End
      </Button>
      <WordCard
        word={wordToReview[index]}
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  reviewButton: {
    marginTop: 16,
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
  },
});
