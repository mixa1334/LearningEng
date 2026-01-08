import PracticeModeSettings from "@/src/components/learn/practice/PracticeModeSettings";
import PracticeModeWrapper, { PracticeModeChildProps } from "@/src/components/learn/practice/PracticeModeWrapper";
import WordBuildingMode from "@/src/components/learn/practice/mods/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/practice/mods/WordPairsMode";
import WordsOverview from "@/src/components/learn/practice/mods/WordsOverview";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useAppTheme } from "../../common/ThemeProvider";

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
    descriptionText: "Review your vocabulary words one by one and mark the ones you know",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
  [ExtraMode.PAIRS]: {
    component: WordPairsMode,
    descriptionText: "Match each Russian word with its English translation",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength >= 2,
  },
  [ExtraMode.BUILDER]: {
    component: WordBuildingMode,
    descriptionText: "Build the English word by picking letters in the correct order",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
};

const config = [
  { value: ExtraMode.OVERVIEW, label: "Review" },
  { value: ExtraMode.PAIRS, label: "Pairs" },
  { value: ExtraMode.BUILDER, label: "Builder" },
];

export default function PracticeMainSection() {
  const theme = useAppTheme();
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode>(ExtraMode.OVERVIEW);

  const ActiveModeComponent = PracticeModeComponents[activeExtraMode].component;

  return (
    <View>
      <View style={[styles.topRow, { backgroundColor: theme.colors.surfaceVariant }]}>
        <PracticeModeSettings />

        <SegmentedButtons
          style={[styles.segmentedButtons, {}]}
          value={activeExtraMode}
          onValueChange={setActiveExtraMode}
          buttons={config.map((btn) => ({
            ...btn,
            style: {
              backgroundColor: btn.value === activeExtraMode ? theme.colors.secondary : theme.colors.surface,
            },
            labelStyle: {
              color: btn.value === activeExtraMode ? theme.colors.onSecondary : theme.colors.onSurface,
            },
          }))}
        />
      </View>

      <PracticeModeWrapper
        descriptionText={PracticeModeComponents[activeExtraMode].descriptionText}
        practiceWordsPoolLengthRule={PracticeModeComponents[activeExtraMode].practiceWordsPoolLengthRule}
      >
        <ActiveModeComponent />
      </PracticeModeWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  segmentedButtons: {
    width: "100%",
  },
});
