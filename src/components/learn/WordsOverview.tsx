import { usePractice } from "@/src/hooks/usePractice";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import WordCard from "./WordCard";

export default function WordsOverview() {
  const theme = useTheme();

  const { words, loadNextSet, resetSet } = usePractice();

  const noWordsToReview = words.length === 0;

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [index, setIndex] = useState(0);

  const [isStarted, setIsStarted] = useState(false);
  const [isSetEnded, setIsSetEnded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const resetProgress = async () => {
    setAcceptedCount(0);
    setRejectedCount(0);
    setIndex(0);
    setIsStarted(false);
    setIsCompleted(false);
    setIsSetEnded(false);
    if (noWordsToReview) {
      resetSet();
    }
  };

  const startSession = () => {
    resetProgress();
    setIsStarted(true);
  };

  const endSession = () => {
    setIsCompleted(true);
  };

  const updateIndex = () => {
    let newIndex = index + 1;
    if (newIndex === words.length) {
      newIndex = 0;
      setIsSetEnded(true);
    }
    setIndex(newIndex);
  };

  const loadMoreWordsToLearn = () => {
    loadNextSet();
    setIndex(0);
    setIsSetEnded(false);
  };

  const accept = () => {
    setAcceptedCount((prev) => prev + 1);
    updateIndex();
  };

  const reject = () => {
    setRejectedCount((prev) => prev + 1);
    updateIndex();
  };

  const calculatePercentage = () => {
    const totalReviewed = acceptedCount + rejectedCount;
    if (totalReviewed === 0) return 0;
    return Math.round((acceptedCount / totalReviewed) * 100);
  };

  if (noWordsToReview && !isStarted) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
          No words to review, adjust settings above or add more words!
        </Text>
      </View>
    );
  }

  if (noWordsToReview || isCompleted) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.resultText, { color: theme.colors.onPrimary }]}>
          You remembered {calculatePercentage()}% of words
        </Text>
        <Button
          mode="contained-tonal"
          onPress={startSession}
          style={styles.reviewBtn}
          icon="restart"
        >
          Review again
        </Button>
      </View>
    );
  }

  if (!isStarted) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
          Review your vocabulary words one by one and mark the ones you know.
        </Text>
        <Button
          mode="contained-tonal"
          onPress={startSession}
          style={styles.reviewBtn}
          icon="play"
        >
          Start
        </Button>
      </View>
    );
  }

  if (isSetEnded) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.resultText, { color: theme.colors.onPrimary }]}>
          You remembered {calculatePercentage()}% of words
        </Text>
        <Button
          mode="contained-tonal"
          onPress={loadMoreWordsToLearn}
          style={styles.reviewBtn}
          icon="play"
        >
          Load next set
        </Button>
        <Button
          mode="contained-tonal"
          onPress={endSession}
          style={styles.reviewBtn}
          icon="flag-checkered"
        >
          End session
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sessionContent}>
        <View
          style={[
            styles.progressCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Text
            style={[styles.progressText, { color: theme.colors.onSurface }]}
          >
            Reviewed {index} / {words.length}
          </Text>
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Known: {acceptedCount}
          </Text>
        </View>
        <WordCard
          word={words[index]}
          accept={accept}
          acceptBtnName="Know"
          reject={reject}
          rejectBtnName="Don't know"
        />
        <Button
          mode="contained-tonal"
          onPress={endSession}
          style={[
            styles.endBtn,
            { backgroundColor: theme.colors.errorContainer },
          ]}
          icon="flag-checkered"
        >
          End session
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  topRowLabel: {
    fontSize: 15,
    fontWeight: "600",
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
  sessionContent: {
    flex: 1,
  },
  progressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
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
