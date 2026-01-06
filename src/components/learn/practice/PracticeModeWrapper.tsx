import { usePractice } from "@/src/hooks/usePractice";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAutoScroll } from "../../common/AutoScrollContext";
import { useAppTheme } from "../../common/ThemeProvider";

export type PracticeModeChildProps = {
  onEndCurrentSet?: (endMessage: string) => void;
  onEndSession?: (endMessage: string) => void;
};

interface PracticeModeWrapperProps {
  readonly descriptionText: string;
  readonly practiceWordsPoolLengthRule: (wordsPoolLength: number) => boolean;
  readonly children: React.ReactElement<PracticeModeChildProps>;
}

export default function PracticeModeWrapper(props: PracticeModeWrapperProps) {
  const { triggerScroll } = useAutoScroll();
  const theme = useAppTheme();

  const { words, loadNextSet, resetSet } = usePractice();

  const noWordsToReview = !props.practiceWordsPoolLengthRule(words.length);

  const [childTextMessage, setChildTextMessage] = useState("");

  const [isStarted, setIsStarted] = useState(false);
  const [isSetEnded, setIsSetEnded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    resetProgress();
  }, [props.children]);

  const resetProgress = () => {
    setIsStarted(false);
    setIsCompleted(false);
    setIsSetEnded(false);
    setChildTextMessage("");
    if (noWordsToReview) {
      resetSet();
    }
  };

  const startSession = () => {
    resetProgress();
    if (noWordsToReview) return;
    setIsStarted(true);
    triggerScroll();
  };

  const endSession = () => {
    setIsCompleted(true);
  };

  const loadMoreWordsToLearn = () => {
    loadNextSet();
    setIsSetEnded(false);
    triggerScroll();
  };

  if (noWordsToReview && !isStarted) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onSecondaryContainer }]}>No words to practice</Text>
      </View>
    );
  }

  if (isCompleted || noWordsToReview) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.resultText, { color: theme.colors.onSecondaryContainer }]}>{childTextMessage}</Text>
        <Button
          mode="contained-tonal"
          onPress={startSession}
          style={[styles.reviewBtn, { backgroundColor: theme.colors.onPrimaryContainer }]}
          textColor={theme.colors.onPrimary}
          icon="restart"
        >
          Start again
        </Button>
      </View>
    );
  }

  if (!isStarted) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onSecondaryContainer }]}>{props.descriptionText}</Text>
        <Button
          mode="contained-tonal"
          onPress={startSession}
          style={[styles.reviewBtn, { backgroundColor: theme.colors.onPrimaryContainer }]}
          textColor={theme.colors.onPrimary}
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
        <Text style={[styles.resultText, { color: theme.colors.onSecondaryContainer }]}>You have finished current set</Text>

        <View style={styles.buttonsRow}>
          <Button
            mode="contained-tonal"
            onPress={endSession}
            style={[styles.reviewBtn, { backgroundColor: theme.colors.reject }]}
            textColor={theme.colors.onAcceptReject}
            icon="flag-checkered"
          >
            End
          </Button>
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

  return React.cloneElement(props.children, {
    onEndCurrentSet: (endMessage) => {
      setIsSetEnded(true);
      setChildTextMessage(endMessage);
    },
    onEndSession: (endMessage) => {
      setIsCompleted(true);
      setChildTextMessage(endMessage);
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
