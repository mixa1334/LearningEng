import { usePractice } from "@/src/hooks/usePractice";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAutoScroll } from "../../common/AutoScrollContext";
import { useAppTheme } from "../../common/ThemeProvider";

export type PracticeModeChildProps = {
  readonly onEndCurrentSet?: (endMessage: string) => void;
};

interface PracticeModeWrapperProps {
  readonly practiceWordsPoolLengthRule: (wordsPoolLength: number) => boolean;
  readonly children: React.ReactElement<PracticeModeChildProps>;
}

export default function PracticeModeWrapper({ practiceWordsPoolLengthRule, children }: PracticeModeWrapperProps) {
  const { triggerScroll } = useAutoScroll();
  const theme = useAppTheme();

  const { words, loadNextPracticeSet, resetPracticeSet } = usePractice();

  const noWordsToReview = !practiceWordsPoolLengthRule(words.length);

  const [childTextMessage, setChildTextMessage] = useState("");

  const [isSetEnded, setIsSetEnded] = useState(false);

  const [isOverLoadedSession, setIsOverLoadedSession] = useState(false);

  const resetPracticeSession = () => {
    resetPracticeSet();
    setIsSetEnded(false);
    triggerScroll();
  };

  const loadMoreWordsToLearn = () => {
    loadNextPracticeSet();
    setIsSetEnded(false);
    triggerScroll();
  };

  if (noWordsToReview) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onSecondaryContainer }]}>No words to practice</Text>
        {isOverLoadedSession && (
          <Button
            mode="contained-tonal"
            onPress={resetPracticeSession}
            style={[styles.reviewBtn, { backgroundColor: theme.colors.onPrimaryContainer }]}
            textColor={theme.colors.primaryContainer}
            icon="restart"
          >
            Reset session
          </Button>
        )}
      </View>
    );
  }

  if (isSetEnded) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.resultText, { color: theme.colors.onSecondaryContainer }]}>You have finished current set</Text>
        <Text style={[styles.resultText, { color: theme.colors.onSecondaryContainer }]}>{childTextMessage}</Text>

        <View style={styles.buttonsRow}>
          <Button
            mode="contained-tonal"
            onPress={loadMoreWordsToLearn}
            style={[styles.reviewBtn, { backgroundColor: theme.colors.onPrimaryContainer }]}
            textColor={theme.colors.primaryContainer}
            icon="play"
          >
            Continue
          </Button>
        </View>
      </View>
    );
  }

  return React.cloneElement(children, {
    onEndCurrentSet: (endMessage) => {
      setIsSetEnded(true);
      setChildTextMessage(endMessage);
      setIsOverLoadedSession(true);
    },
  });
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
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
  },
  endBtn: {
    borderRadius: 8,
  },
});
