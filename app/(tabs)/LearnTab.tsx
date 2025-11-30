import WordScreen from "@/components/learn/WordScreen";
import { useLearningDailySet, useLearnUtil } from "@/hooks/useLearn";
import { SPACING_MD, SPACING_XXL } from "@/resources/constants/layout";
import React, { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum ActiveLearningTab {
  learn = "learn_tab",
  review = "review_tab",
}

export default function LearnTab() {
  const [activeTab, setActiveTab] = useState<ActiveLearningTab>(
    ActiveLearningTab.learn
  );
  const { wordsToReview, wordsToLearn, status, error, reloadDailySet } =
    useLearningDailySet();

  const {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  } = useLearnUtil();

  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const contentHorizontalPadding = SPACING_MD;
  const contentTopPadding = insets.top + SPACING_MD;
  const contentBottomPadding = insets.bottom + SPACING_XXL;

  const switchToLearnScreen = () => setActiveTab(ActiveLearningTab.learn);
  const switchToReviewScreen = () => setActiveTab(ActiveLearningTab.review);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      reloadDailySet();
      setRefreshing(false);
    }, 200);
  };

  if (status === "loading") {
    return (
      <View
        style={[
          styles.page,
          {
            backgroundColor: theme.colors.background,
            paddingTop: contentTopPadding,
            paddingBottom: contentBottomPadding,
            paddingHorizontal: contentHorizontalPadding,
          },
        ]}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.fullCenter}>
            <Text style={{ color: theme.colors.onSurface }}>
              Loading words...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.fullCenter}>
            <Text style={{ color: theme.colors.error, marginBottom: 12 }}>
              Error: {error}
            </Text>
            <TouchableOpacity onPress={reloadDailySet}>
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.page,
        {
          backgroundColor: theme.colors.background,
          paddingTop: contentTopPadding,
          paddingBottom: contentBottomPadding,
          paddingHorizontal: contentHorizontalPadding,
        },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View
          style={[
            styles.tabButtons,
            {
              borderBottomColor: theme.colors.outline,
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.topBtn,
              activeTab === ActiveLearningTab.learn && {
                borderBottomColor: theme.colors.primary,
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={switchToLearnScreen}
          >
            <Text
              style={[styles.topBtnText, { color: theme.colors.onSurface }]}
            >
              Learn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topBtn,
              activeTab === ActiveLearningTab.review && {
                borderBottomColor: theme.colors.primary,
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={switchToReviewScreen}
          >
            <Text
              style={[styles.topBtnText, { color: theme.colors.onSurface }]}
            >
              Review
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === ActiveLearningTab.learn ? (
            <WordScreen
              words={wordsToLearn}
              accept={markWordCompletelyLearned}
              acceptBtnName="I know"
              reject={startLearnNewWord}
              rejectBtnName="Start learn"
            />
          ) : (
            <WordScreen
              words={wordsToReview}
              accept={markWordReviewed}
              acceptBtnName="I remember"
              reject={markWordNotReviewed}
              rejectBtnName="Show late"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
  },
  tabButtons: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  topBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  topBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
  fullCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
});
