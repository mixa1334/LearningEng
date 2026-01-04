import { useLearningDailySet, useLearnUtil } from "@/src/hooks/useLearn";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import LearningErrorState from "./LearningErrorState";
import WordCard from "./WordCard";

export default function LearningMainMode() {
  const { reviewWord, learnWord, error, reloadDailySet } =
    useLearningDailySet();
  const [isLearnTab, setIsLearnTab] = useState(true);
  const {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  } = useLearnUtil();
  const theme = useTheme();

  const word = isLearnTab ? learnWord : reviewWord;
  const accept = isLearnTab ? markWordCompletelyLearned : markWordReviewed;
  const reject = isLearnTab ? startLearnNewWord : markWordNotReviewed;
  const acceptLabel = isLearnTab ? "I know" : "I remember";
  const rejectLabel = isLearnTab ? "Start learn" : "Show late";

  const handleSelectLearn = () => setIsLearnTab(true);
  const handleSelectReview = () => setIsLearnTab(false);

  if (error) {
    return <LearningErrorState error={error} onRetry={reloadDailySet} />;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabHeader,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              backgroundColor: isLearnTab
                ? theme.colors.primary
                : theme.colors.secondary,
            },
          ]}
          onPress={handleSelectLearn}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: isLearnTab
                  ? theme.colors.onPrimary
                  : theme.colors.onSecondary,
                fontWeight: isLearnTab ? "600" : "400",
              },
            ]}
          >
            Learn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              backgroundColor: isLearnTab
                ? theme.colors.secondary
                : theme.colors.primary,
            },
          ]}
          onPress={handleSelectReview}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: isLearnTab
                  ? theme.colors.onSecondary
                  : theme.colors.onPrimary,
                fontWeight: isLearnTab ? "400" : "600",
              },
            ]}
          >
            Review
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {word === undefined ? (
          <View style={[styles.completeMsg, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text
              style={[styles.emptyText, { color: theme.colors.onBackground }]}
            >
              You&apos;ve completed daily set!
            </Text>
            <Button
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={reloadDailySet}
            >
              Load one more daily set
            </Button>
          </View>
        ) : (
          <WordCard
            word={word}
            accept={accept}
            acceptBtnName={acceptLabel}
            reject={reject}
            rejectBtnName={rejectLabel}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    overflow: "hidden",
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
    gap: 15,
    borderRadius: 30,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
  completeMsg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 15,
    marginTop: 10,
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
