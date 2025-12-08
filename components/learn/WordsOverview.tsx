import { useVocabulary } from "@/hooks/useVocabulary";
import { Word } from "@/model/entity/types";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Switch, useTheme } from "react-native-paper";
import WordCard from "./WordCard";

export default function WordsOverview() {
  const theme = useTheme();

  const [onlyUserAddedWords, setOnlyUserAddedWords] = useState(true);
  const { userWords, preloadedWords } = useVocabulary();
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [wordToReview, setWordToReview] = useState<Word[]>([]);

  useEffect(() => {
    if (onlyUserAddedWords) {
      setWordToReview(userWords);
    } else {
      setWordToReview([...userWords, ...preloadedWords]);
    }
    reset();
  }, [userWords, preloadedWords, onlyUserAddedWords]);

  const switchOnlyUserAddedWords = () => {
    setOnlyUserAddedWords(!onlyUserAddedWords);
  };

  const reset = () => {
    setAccepted(0);
    setRejected(0);
    setIndex(0);
    setEnded(false);
  };

  const updateTotalCounter = () => {
    setIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= wordToReview.length) {
        setEnded(true);
      }
      return newIndex;
    });
  };

  const accept = () => {
    setAccepted((prev) => prev + 1);
    updateTotalCounter();
  };

  const reject = () => {
    setRejected((prev) => prev + 1);
    updateTotalCounter();
  };

  const end = () => setEnded(true);

  const calculatePercentage = () => {
    if (index === 0) return 0;
    return Math.round((accepted / index) * 100);
  };

  if (wordToReview.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
          No words to review, try to add some words to your vocabulary!
        </Text>
        <Button
          mode="contained-tonal"
          onPress={switchOnlyUserAddedWords}
          style={[styles.endBtn, { backgroundColor: theme.colors.secondaryContainer }]}
          icon="play"
        >
          Start prebuild words
        </Button>
      </View>
    );
  }

  if (ended) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.resultText, { color: theme.colors.primary }]}>You remembered {calculatePercentage()}% of words</Text>
        <Button mode="contained-tonal" onPress={reset} style={styles.reviewBtn}>
          Review again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Only User Added Words</Text>
        <Switch value={onlyUserAddedWords} onValueChange={switchOnlyUserAddedWords} />
      </View>
      <View style={styles.section}>
        <Text style={[styles.progressText, { color: theme.colors.onSurface }]}>
          Reviewed {index} / {wordToReview.length}
        </Text>
        <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>Known: {accepted}</Text>
      </View>
      <WordCard word={wordToReview[index]} accept={accept} acceptBtnName="Know" reject={reject} rejectBtnName="Don't know" />
      <Button
        mode="contained-tonal"
        onPress={end}
        style={[styles.endBtn, { backgroundColor: theme.colors.errorContainer }]}
        icon="flag-checkered"
      >
        End session
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  reviewBtn: {
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  endBtn: {
    marginVertical: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});
