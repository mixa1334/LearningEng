import {
  AutoScrollProvider,
  useAutoScroll,
} from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import ExpandedSection from "@/src/components/common/ExpandedSection";
import LearningContent from "@/src/components/learn/LearningContent";
import LearningErrorState from "@/src/components/learn/LearningErrorState";
import WordBuildingMode from "@/src/components/learn/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/WordPairsMode";
import WordsOverview from "@/src/components/learn/WordsOverview";
import { useLearningDailySet } from "@/src/hooks/useLearn";
import {
  SPACING_MD,
  SPACING_XXL,
  TAB_BAR_BASE_HEIGHT,
} from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum ExtraMode {
  OVERVIEW = "overview",
  PAIRS = "pairs",
  BUILDER = "builder",
}

export default function LearnTab() {
  return (
    <AutoScrollProvider>
      <LearnTabContent />
    </AutoScrollProvider>
  );
}

function LearnTabContent() {
  const { scrollViewRef } = useAutoScroll();
  const { wordsToReview, wordsToLearn, error, reloadDailySet } =
    useLearningDailySet();

  const [refreshing, setRefreshing] = useState(false);
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode | null>(
    null
  );
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const contentHorizontalPadding = SPACING_MD;
  const contentTopPadding = SPACING_XXL;
  const contentBottomPadding =
    insets.bottom + SPACING_XXL + TAB_BAR_BASE_HEIGHT;

  const handleExtraModePress = (mode: ExtraMode) => {
    setActiveExtraMode((prev) => (prev === mode ? null : mode));
  };

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
      ref={scrollViewRef}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        paddingTop: contentTopPadding,
        paddingBottom: contentBottomPadding,
        paddingHorizontal: contentHorizontalPadding,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <ContentDivider name="Learning" />
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <LearningContent
          wordsToLearn={wordsToLearn}
          wordsToReview={wordsToReview}
        />
      </View>

      <View style={{ marginTop: SPACING_XXL * 2 }}>
        <ContentDivider name="Practice more" />
      </View>

      <ExpandedSection
        title="Quick review"
        isExpanded={activeExtraMode === ExtraMode.OVERVIEW}
        onPress={() => handleExtraModePress(ExtraMode.OVERVIEW)}
      >
        <WordsOverview />
      </ExpandedSection>

      <ExpandedSection
        title="Word pairs"
        isExpanded={activeExtraMode === ExtraMode.PAIRS}
        onPress={() => handleExtraModePress(ExtraMode.PAIRS)}
      >
        <WordPairsMode />
      </ExpandedSection>

      <ExpandedSection
        title="Build the word"
        isExpanded={activeExtraMode === ExtraMode.BUILDER}
        onPress={() => handleExtraModePress(ExtraMode.BUILDER)}
      >
        <WordBuildingMode />
      </ExpandedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
    marginBottom: SPACING_MD,
  },
});
