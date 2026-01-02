import AnimatedScrollView from "@/src/components/common/AnimatedScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import ExpandedSection from "@/src/components/common/ExpandedSection";
import LearningContent from "@/src/components/learn/LearningContent";
import LearningErrorState from "@/src/components/learn/LearningErrorState";
import WordBuildingMode from "@/src/components/learn/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/WordPairsMode";
import WordsOverview from "@/src/components/learn/WordsOverview";
import { useLearningDailySet } from "@/src/hooks/useLearn";
import { SPACING_MD, SPACING_XXL } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

enum ExtraMode {
  OVERVIEW = "overview",
  PAIRS = "pairs",
  BUILDER = "builder",
}

export default function LearnTab() {
  const { wordsToReview, wordsToLearn, error, reloadDailySet } =
    useLearningDailySet();
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode | null>(
    null
  );
  const theme = useTheme();

  const refreshAction = () => {
    reloadDailySet();
  };
  const handleExtraModePress = (mode: ExtraMode) => {
    setActiveExtraMode((prev) => (prev === mode ? null : mode));
  };

  if (error) {
    return <LearningErrorState error={error} onRetry={reloadDailySet} />;
  }

  return (
    <AutoScrollProvider>
      <AnimatedScrollView
        title="Learn"
        refreshingEnabled={true}
        refreshAction={refreshAction}
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
      </AnimatedScrollView>
    </AutoScrollProvider>
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
