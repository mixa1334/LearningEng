import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import ExpandedSection from "@/src/components/common/ExpandedSection";
import LearningMainMode from "@/src/components/learn/LearningMainMode";
import PracticeModeSettings from "@/src/components/learn/PracticeModeSettings";
import PracticeModeWrapper from "@/src/components/learn/PracticeModeWrapper";
import WordBuildingMode from "@/src/components/learn/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/WordPairsMode";
import WordsOverview from "@/src/components/learn/WordsOverview";
import { SPACING_XL } from "@/src/resources/constants/layout";
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
      <AnimatedScrollView headerTitle="Learning & Practice">
        <ContentDivider name="Learning" />

        <LearningMainMode />

        <View style={{ marginTop: SPACING_XL }}>
          <ContentDivider name="Practice more" />
        </View>

        <PracticeModeSettings />

        <ExpandedSection
          title="Quick review"
          isExpanded={activeExtraMode === ExtraMode.OVERVIEW}
          onPress={() => handleModeSectionPress(ExtraMode.OVERVIEW)}
        >
          <PracticeModeWrapper
            descriptionText="Review your vocabulary words one by one and mark the ones you know."
            practiceWordsPoolLengthRule={(wordsPoolLength) =>
              wordsPoolLength !== 0
            }
          >
            <WordsOverview />
          </PracticeModeWrapper>
        </ExpandedSection>

        <ExpandedSection
          title="Word pairs"
          isExpanded={activeExtraMode === ExtraMode.PAIRS}
          onPress={() => handleModeSectionPress(ExtraMode.PAIRS)}
        >
          <PracticeModeWrapper
            descriptionText="Match each Russian word with its English translation."
            practiceWordsPoolLengthRule={(wordsPoolLength) =>
              wordsPoolLength >= 2
            }
          >
            <WordPairsMode />
          </PracticeModeWrapper>
        </ExpandedSection>

        <ExpandedSection
          title="Build the word"
          isExpanded={activeExtraMode === ExtraMode.BUILDER}
          onPress={() => handleModeSectionPress(ExtraMode.BUILDER)}
        >
          <PracticeModeWrapper
            descriptionText="Build the English word by picking letters in the correct order."
            practiceWordsPoolLengthRule={(wordsPoolLength) =>
              wordsPoolLength !== 0
            }
          >
            <WordBuildingMode />
          </PracticeModeWrapper>
        </ExpandedSection>
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
