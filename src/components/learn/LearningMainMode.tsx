import { Word } from "@/src/entity/types";
import { useLearningDailySet, useLearnUtil } from "@/src/hooks/useLearn";
import { SPACING_MD } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import LearningErrorState from "./LearningErrorState";
import WordCard from "./WordCard";

export default function LearningMainMode() {
  const { wordsToLearn, wordsToReview, error, reloadDailySet } =
    useLearningDailySet();
  const [isLearnTab, setIsLearnTab] = useState(true);
  const {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  } = useLearnUtil();
  const theme = useTheme();

  const words: Word[] = isLearnTab ? wordsToLearn : wordsToReview;
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
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View
        style={[styles.tabHeader, { backgroundColor: theme.colors.secondary }]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            isLearnTab && {
              borderBottomColor: theme.colors.surface,
              backgroundColor: theme.colors.outline,
            },
          ]}
          onPress={handleSelectLearn}
        >
          <Text style={[styles.tabLabel, { color: theme.colors.onPrimary }]}>
            Learn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            !isLearnTab && {
              borderBottomColor: theme.colors.surface,
              backgroundColor: theme.colors.outline,
            },
          ]}
          onPress={handleSelectReview}
        >
          <Text style={[styles.tabLabel, { color: theme.colors.onPrimary }]}>
            Review
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {words.length === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: theme.colors.onPrimary }]}>
              You completed tasks, come back later!
            </Text>
          </View>
        ) : (
          <WordCard
            word={words[0]}
            accept={() => accept(words[0])}
            acceptBtnName={acceptLabel}
            reject={() => reject(words[0])}
            rejectBtnName={rejectLabel}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
    marginBottom: SPACING_MD,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
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
  center: {
    // flex: 1,
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
