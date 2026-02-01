import { useLearningDailySet, useLearnUtil } from "@/src/hooks/useLearn";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { getCardShadow } from "../../common/cardShadow";
import { useHaptics } from "../../common/HapticsProvider";
import { useLanguageContext } from "../../common/LanguageProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import LearningErrorState from "../LearningErrorState";
import WordCard from "../WordCard";

const TAB_GAP = 4;

export default function LearningMainMode() {
  const { reviewWord, learnWord, error, reloadDailySet, loadExtraDailySet } = useLearningDailySet();
  const [isLearnTab, setIsLearnTab] = useState(true);
  const { markWordReviewed, markWordNotReviewed, startLearnNewWord, markWordCompletelyLearned } = useLearnUtil();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { lightImpact } = useHaptics();

  const word = isLearnTab ? learnWord : reviewWord;
  const accept = isLearnTab ? markWordCompletelyLearned : markWordReviewed;
  const reject = isLearnTab ? startLearnNewWord : markWordNotReviewed;
  const acceptLabel = isLearnTab ? text("learn_accept_label") : text("review_accept_label");
  const rejectLabel = isLearnTab ? text("learn_reject_label") : text("review_reject_label");

  const tabPosition = useSharedValue(0); // 0 = Learn, 1 = Review
  const [tabHeaderWidth, setTabHeaderWidth] = useState(0);

  const innerTabWidth = Math.max(0, tabHeaderWidth - 8); // horizontal padding (4 * 2)
  const tabWidth = innerTabWidth > 0 ? (innerTabWidth - TAB_GAP) / 2 : 0;

  const tabIndicatorAnimatedStyle = useAnimatedStyle(() => {
    if (tabWidth <= 0) {
      return {};
    }

    return {
      transform: [
        {
          translateX: interpolate(tabPosition.value, [0, 1], [0, tabWidth + TAB_GAP]),
        },
      ],
    };
  });

  const switchTab = (nextIsLearn: boolean) => {
    if (nextIsLearn === isLearnTab) return;
    lightImpact();
    const nextPos = nextIsLearn ? 0 : 1;
    setIsLearnTab(nextIsLearn);
    tabPosition.value = withTiming(nextPos, { duration: 300 });
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
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
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
              },
              tabIndicatorAnimatedStyle,
            ]}
          />
        )}
        <TouchableOpacity style={[styles.tabButton]} onPress={handleSelectLearn}>
          <Text
            style={[
              styles.tabLabel,
              {
                color: isLearnTab ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                fontWeight: isLearnTab ? "700" : "500",
              },
            ]}
          >
            {text("learn_tab_label")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton]} onPress={handleSelectReview}>
          <Text
            style={[
              styles.tabLabel,
              {
                color: isLearnTab ? theme.colors.onSurfaceVariant : theme.colors.onPrimary,
                fontWeight: isLearnTab ? "500" : "700",
              },
            ]}
          >
            {text("review_tab_label")}
          </Text>
        </TouchableOpacity>
      </View>



      <Animated.View
        key={theme.colors.surfaceVariant}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        style={{ width: '100%' }}
      >
        {word === undefined ? (
          <View style={[styles.completeMsg, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }, getCardShadow(theme)]}>
            <View style={styles.completeMsgContent}>
              <MaterialIcons name="check-circle-outline" size={64} color={theme.colors.primary} />
              <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                {isLearnTab ? text("learn_complete_message") : text("review_no_words_message")}
              </Text>
            </View>
            {isLearnTab && (
              <Button
                mode="contained"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                onPress={loadExtraDailySet}
                style={{ marginTop: 24, borderRadius: 12 }}
                contentStyle={{ height: 48 }}
              >
                {text("learn_load_more_words_button")}
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
    paddingTop: 16,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 4,
    gap: TAB_GAP,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
    width: "100%",
    maxWidth: 350,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
    zIndex: 1,
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
  completeMsg: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 24,
    width: "100%",
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 28,
  },
  completeMsgContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
});
