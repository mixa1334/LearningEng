import ContentDivider from "@/components/common/ContentDivider";
import LearningContent from "@/components/learn/LearningContent";
import LearningErrorState from "@/components/learn/LearningErrorState";
import LearningTabHeader from "@/components/learn/LearningTabHeader";
import WordsOverview from "@/components/learn/WordsOverview";
import { useLearningDailySet } from "@/hooks/useLearn";
import { SPACING_MD, SPACING_XXL, TAB_BAR_BASE_HEIGHT } from "@/resources/constants/layout";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
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
  const { wordsToReview, wordsToLearn, error, reloadDailySet } =
    useLearningDailySet();

  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const contentHorizontalPadding = SPACING_MD;
  const contentTopPadding = insets.top + SPACING_XXL;
  const contentBottomPadding = insets.bottom + SPACING_XXL + TAB_BAR_BASE_HEIGHT;

  const switchToLearnScreen = () => setActiveTab(ActiveLearningTab.learn);
  const switchToReviewScreen = () => setActiveTab(ActiveLearningTab.review);
  const isLearnTab = activeTab === ActiveLearningTab.learn;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      reloadDailySet();
      setRefreshing(false);
    }, 200);
  };

  if (error) {
    return <LearningErrorState error={error} onRetry={reloadDailySet} />;
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
      
      <ContentDivider name="Learning" />
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <LearningTabHeader
          isLearnTab={isLearnTab}
          onSelectLearn={switchToLearnScreen}
          onSelectReview={switchToReviewScreen}
        />

        <View style={styles.content}>
          <LearningContent
            isLearnTab={isLearnTab}
            wordsToLearn={wordsToLearn}
            wordsToReview={wordsToReview}
          />
        </View>
      </View>

      <View style={{marginTop: SPACING_XXL * 2}}>
        <ContentDivider name="Quick review" />
      </View>
      
      <WordsOverview />

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
