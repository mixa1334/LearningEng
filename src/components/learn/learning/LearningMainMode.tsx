import { useLearningDailySet, useLearnUtil } from "@/src/hooks/useLearn";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import LearningErrorState from "../LearningErrorState";
import WordCard from "../WordCard";

const TAB_GAP = 15;

export default function LearningMainMode() {
  const { reviewWord, learnWord, error, reloadDailySet, loadExtraDailySet } = useLearningDailySet();
  const [isLearnTab, setIsLearnTab] = useState(true);
  const { markWordReviewed, markWordNotReviewed, startLearnNewWord, markWordCompletelyLearned } = useLearnUtil();
  const theme = useTheme();

  const word = isLearnTab ? learnWord : reviewWord;
  const accept = isLearnTab ? markWordCompletelyLearned : markWordReviewed;
  const reject = isLearnTab ? startLearnNewWord : markWordNotReviewed;
  const acceptLabel = isLearnTab ? "I know" : "I remember";
  const rejectLabel = isLearnTab ? "Start learn" : "Show late";

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const tabPosition = useRef(new Animated.Value(0)).current; // 0 = Learn, 1 = Review
  const [tabHeaderWidth, setTabHeaderWidth] = useState(0);

  const innerTabWidth = Math.max(0, tabHeaderWidth - 8); // horizontal padding (4 * 2)
  const tabWidth = innerTabWidth > 0 ? (innerTabWidth - TAB_GAP) / 2 : 0;

  const switchTab = (nextIsLearn: boolean) => {
    if (nextIsLearn === isLearnTab) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextPos = nextIsLearn ? 0 : 1;

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(tabPosition, {
        toValue: nextPos,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLearnTab(nextIsLearn);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSelectLearn = () => {
    switchTab(true);
  };
  const handleSelectReview = () => {
    switchTab(false);
  };

  if (error) {
    return <LearningErrorState error={error} onRetry={reloadDailySet} />;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabHeader,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outline,
          },
        ]}
        onLayout={(e) => setTabHeaderWidth(e.nativeEvent.layout.width)}
      >
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabWidth,
                backgroundColor: theme.colors.primary,
                transform: [
                  {
                    translateX: tabPosition.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, tabWidth + TAB_GAP],
                    }),
                  },
                ],
              },
            ]}
          />
        )}
        <TouchableOpacity
          style={[
            styles.tabButton,
          ]}
          onPress={handleSelectLearn}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: isLearnTab ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                fontWeight: isLearnTab ? "700" : "500",
              },
            ]}
          >
            Learn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
          ]}
          onPress={handleSelectReview}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: isLearnTab ? theme.colors.onSurfaceVariant : theme.colors.onPrimary,
                fontWeight: isLearnTab ? "500" : "700",
              },
            ]}
          >
            Review
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        {word === undefined ? (
          <View style={[styles.completeMsg, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
              {isLearnTab ? "You've completed daily set!" : "No words to review, come back later!"}
            </Text>
            {isLearnTab && (
              <Button buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary} onPress={loadExtraDailySet}>
                Load more words
              </Button>
            )}
          </View>
        ) : (
          <WordCard word={word} accept={accept} acceptBtnName={acceptLabel} reject={reject} rejectBtnName={rejectLabel} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 4,
    gap: TAB_GAP,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: "center",
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 30,
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
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
  },
  completeMsg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 15,
    marginTop: 10,
    borderRadius: 20,
    width: "100%",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
