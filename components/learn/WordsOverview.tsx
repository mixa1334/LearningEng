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
      <View style={[styles.container, styles.center]}>
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
          No words to review
        </Text>
      </View>
    );
  }

  if (ended) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text
          style={[
            styles.emptyText,
            { color: (theme.colors as any).onSecondaryContainer ?? theme.colors.onSurface },
          ]}
        >
          You remembered {calculatePercentage()}% of words
        </Text>
        <Button mode="contained-tonal" onPress={reset} style={styles.reviewBtn}>
          Review again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text
          style={[
            styles.text,
            { color: theme.colors.onSurface },
          ]}
        >
          Reviewed {index} / {wordToReview.length}
        </Text>
        <Text
          style={[
            styles.text,
            { color: theme.colors.onSurface },
          ]}
        >
          Known: {accepted}
        </Text>
      </View>
      <Button
        mode="contained-tonal"
        onPress={end}
        style={styles.endBtn}
        icon="flag-checkered"
      >
        End session
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
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  center: {
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
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  endBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  reviewBtn: {
    marginTop: 8,
  },
});
