import PracticeModeSettings from "@/src/components/learn/practice/PracticeModeSettings";
import PracticeModeWrapper, { PracticeModeChildProps } from "@/src/components/learn/practice/PracticeModeWrapper";
import WordBuildingMode from "@/src/components/learn/practice/mods/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/practice/mods/WordPairsMode";
import WordsOverview from "@/src/components/learn/practice/mods/WordsOverview";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

enum ExtraMode {
  OVERVIEW = "overview",
  PAIRS = "pairs",
  BUILDER = "builder",
}

const PracticeModeComponents: Record<
  ExtraMode,
  {
    component: React.ComponentType<PracticeModeChildProps>;
    descriptionText: string;
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => boolean;
  }
> = {
  [ExtraMode.OVERVIEW]: {
    component: WordsOverview,
    descriptionText: "Review your vocabulary words one by one and mark the ones you know.",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
  [ExtraMode.PAIRS]: {
    component: WordPairsMode,
    descriptionText: "Match each Russian word with its English translation.",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength >= 2,
  },
  [ExtraMode.BUILDER]: {
    component: WordBuildingMode,
    descriptionText: "Build the English word by picking letters in the correct order.",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
};

export default function PracticeMainSection() {
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode>(ExtraMode.OVERVIEW);

  const ActiveModeComponent = PracticeModeComponents[activeExtraMode].component;

  return (
    <View>
      <PracticeModeSettings />

      <SegmentedButtons
        value={activeExtraMode}
        onValueChange={setActiveExtraMode}
        buttons={[
          {
            value: ExtraMode.OVERVIEW,
            label: "Quick review",
          },
          {
            value: ExtraMode.PAIRS,
            label: "Word pairs",
          },
          { value: ExtraMode.BUILDER, label: "Build the word" },
        ]}
      />

      <PracticeModeWrapper
        descriptionText={PracticeModeComponents[activeExtraMode].descriptionText}
        practiceWordsPoolLengthRule={PracticeModeComponents[activeExtraMode].practiceWordsPoolLengthRule}
      >
        <ActiveModeComponent />
      </PracticeModeWrapper>
    </View>
  );
}

const styles = StyleSheet.create({});
