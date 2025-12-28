import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Switch, useTheme } from "react-native-paper";
import WordCard from "./WordCard";

export default function WordsOverview() {
  const theme = useTheme();

  const { userWords, preloadedWords } = useVocabulary();

  const [onlyUserAddedWords, setOnlyUserAddedWords] = useState(true);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [index, setIndex] = useState(0);

  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const wordsPool = useMemo(
    () => (onlyUserAddedWords ? userWords : [...userWords, ...preloadedWords]),
    [onlyUserAddedWords, userWords, preloadedWords]
  );

  const resetProgress = () => {
    setAccepted(0);
    setRejected(0);
    setIndex(0);
  };

  const resetSession = () => {
    resetProgress();
    setIsStarted(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    // when source words or filter changes, stop current session
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsPool.length]);

  const switchOnlyUserAddedWords = () => {
    setOnlyUserAddedWords((prev) => !prev);
  };

  const startSession = () => {
    if (wordsPool.length === 0) return;
    resetProgress();
    setIsCompleted(false);
    setIsStarted(true);
  };

  const endSession = () => {
    setIsStarted(false);
    if (index > 0) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const updateTotalCounter = () => {
    setIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= wordsPool.length) {
        setIsStarted(false);
        if (newIndex > 0) {
          setIsCompleted(true);
        }
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

  const calculatePercentage = () => {
    const totalReviewed = accepted + rejected;
    if (totalReviewed === 0) return 0;
    return Math.round((accepted / totalReviewed) * 100);
  };

  const handleUsePrebuiltWords = () => {
    setOnlyUserAddedWords(false);
  };

  const hasWords = wordsPool.length > 0;

  const renderContent = () => {
    if (!hasWords) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
            No words to review, try to add some words to your vocabulary!
          </Text>
          {preloadedWords.length > 0 && (
            <Button
              mode="contained-tonal"
              onPress={handleUsePrebuiltWords}
              style={[styles.endBtn, { backgroundColor: theme.colors.secondaryContainer }]}
              icon="play"
            >
              Use prebuilt words
            </Button>
          )}
        </View>
      );
    }

    if (!isStarted && !isCompleted) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.infoText, { color: theme.colors.onPrimary }]}>
            Review your vocabulary words one by one and mark the ones you know.
          </Text>
          <Button mode="contained-tonal" onPress={startSession} style={styles.reviewBtn} icon="play">
            Start
          </Button>
        </View>
      );
    }

    if (!isStarted && isCompleted) {
      return (
        <View style={styles.centered}>
          <Text style={[styles.resultText, { color: theme.colors.onPrimary }]}>
            You remembered {calculatePercentage()}% of words
          </Text>
          <Button mode="contained-tonal" onPress={startSession} style={styles.reviewBtn} icon="restart">
            Review again
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.sessionContent}>
        <View style={[styles.progressCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.progressText, { color: theme.colors.onSurface }]}>
            Reviewed {index} / {wordsPool.length}
          </Text>
          <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>Known: {accepted}</Text>
        </View>
        <WordCard
          word={wordsPool[index]}
          accept={accept}
          acceptBtnName="Know"
          reject={reject}
          rejectBtnName="Don't know"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topRow, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text style={[styles.topRowLabel, { color: theme.colors.onSurface }]}>Only user added words</Text>
        <Switch value={onlyUserAddedWords} onValueChange={switchOnlyUserAddedWords} />
      </View>

      {renderContent()}

      {isStarted && (
        <Button
          mode="contained-tonal"
          onPress={endSession}
          style={[styles.endBtn, { backgroundColor: theme.colors.errorContainer }]}
          icon="flag-checkered"
        >
          End session
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
