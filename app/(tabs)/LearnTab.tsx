import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import ExpandedSection from "@/src/components/common/ExpandedSection";
import LearningMainMode from "@/src/components/learn/LearningMainMode";
import PracticeModeSettings from "@/src/components/learn/PracticeModeSettings";
import WordBuildingMode from "@/src/components/learn/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/WordPairsMode";
import WordsOverview from "@/src/components/learn/WordsOverview";
import { SPACING_XXL } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { View } from "react-native";

enum ExtraMode {
  SETTINGS = "settings",
  OVERVIEW = "overview",
  PAIRS = "pairs",
  BUILDER = "builder",
}

export default function LearnTab() {
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode | null>(
    null
  );

  const handleModeSectionPress = (mode: ExtraMode) => {
    setActiveExtraMode((prev) => (prev === mode ? null : mode));
  };

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle="Learn">
        <ContentDivider name="Learning" />

        <LearningMainMode />

        <View style={{ marginTop: SPACING_XXL * 2 }}>
          <ContentDivider name="Practice more" />
        </View>

        <ExpandedSection
          title="Settings"
          isExpanded={activeExtraMode === ExtraMode.SETTINGS}
          onPress={() => handleModeSectionPress(ExtraMode.SETTINGS)}
        >
          <PracticeModeSettings />
        </ExpandedSection>

        <ExpandedSection
          title="Quick review"
          isExpanded={activeExtraMode === ExtraMode.OVERVIEW}
          onPress={() => handleModeSectionPress(ExtraMode.OVERVIEW)}
        >
          <WordsOverview />
        </ExpandedSection>

        <ExpandedSection
          title="Word pairs"
          isExpanded={activeExtraMode === ExtraMode.PAIRS}
          onPress={() => handleModeSectionPress(ExtraMode.PAIRS)}
        >
          <WordPairsMode />
        </ExpandedSection>

        <ExpandedSection
          title="Build the word"
          isExpanded={activeExtraMode === ExtraMode.BUILDER}
          onPress={() => handleModeSectionPress(ExtraMode.BUILDER)}
        >
          <WordBuildingMode />
        </ExpandedSection>
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
