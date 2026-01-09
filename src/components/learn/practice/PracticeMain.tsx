import PracticeModeSettings from "@/src/components/learn/practice/PracticeModeSettings";
import PracticeModeWrapper, { PracticeModeChildProps } from "@/src/components/learn/practice/PracticeModeWrapper";
import MatchPairsMode from "@/src/components/learn/practice/mods/MatchPairsMode";
import WordBuildingMode from "@/src/components/learn/practice/mods/WordBuildingMode";
import WordsOverview from "@/src/components/learn/practice/mods/WordsOverview";
import { usePractice } from "@/src/hooks/usePractice";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";
import { useAutoScroll } from "../../common/AutoScrollContext";
import { useAppTheme } from "../../common/ThemeProvider";

export enum ExtraMode {
  OVERVIEW = "Quick Overview",
  PAIRS = "Word Pairs",
  BUILDER = "Word Builder",
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
    component: MatchPairsMode,
    descriptionText: "Match each Russian word with its English translation",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength >= 2,
  },
  [ExtraMode.BUILDER]: {
    component: WordBuildingMode,
    descriptionText: "Build the English word by picking letters in the correct order",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
};

export const extraModeLabels = [
  { value: ExtraMode.OVERVIEW, label: "Review" },
  { value: ExtraMode.PAIRS, label: "Pairs" },
  { value: ExtraMode.BUILDER, label: "Builder" },
];

export default function PracticeMain() {
  const { triggerScroll } = useAutoScroll();
  const { resetPracticeSet } = usePractice();
  const theme = useAppTheme();
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode>(ExtraMode.OVERVIEW);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const ActiveModeComponent = PracticeModeComponents[activeExtraMode].component;

  const handleModeChange = (newMode: ExtraMode) => {
    setIsSessionStarted(false);
    resetPracticeSet();
    setActiveExtraMode(newMode);
  };

  const handleSessionStart = () => {
    setIsSessionStarted(true);
    triggerScroll();
  };

  const handleSessionEnd = () => {
    setIsSessionStarted(false);
    resetPracticeSet();
  };

  const handleSettingsToggler = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSettingsVisible((prev) => !prev);
    resetPracticeSet();
    triggerScroll();
  };

  const renderHeaderSection = () => {
    if (isSessionStarted) {
      return (
        <View style={[styles.topRow, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{activeExtraMode} session</Text>
          <Button
            mode="contained-tonal"
            onPress={handleSessionEnd}
            style={[styles.sessionBtn, { backgroundColor: theme.colors.reject }]}
            textColor={theme.colors.onAcceptReject}
            icon="flag-checkered"
          >
            End
          </Button>
        </View>
      );
    }

    return (
      <View style={[styles.topRow, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Pressable
          onPress={handleSettingsToggler}
          style={({ pressed }) => [
            styles.settingToggler,
            {
              backgroundColor: isSettingsVisible ? theme.colors.error : theme.colors.surface,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <MaterialIcons name="settings" size={24} color={isSettingsVisible ? theme.colors.onError : theme.colors.onSurface} />
        </Pressable>

        <SegmentedButtons
          style={styles.segmentedButtons}
          value={activeExtraMode}
          onValueChange={handleModeChange}
          buttons={extraModeLabels.map((btn) => ({
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
    );
  };

  const renderMainSection = () => {
    if (isSettingsVisible) {
      return <PracticeModeSettings />;
    }
    if (isSessionStarted) {
      return (
        <PracticeModeWrapper practiceWordsPoolLengthRule={PracticeModeComponents[activeExtraMode].practiceWordsPoolLengthRule}>
          <ActiveModeComponent />
        </PracticeModeWrapper>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={[styles.infoText, { color: theme.colors.onSecondaryContainer }]}>
          {PracticeModeComponents[activeExtraMode].descriptionText}
        </Text>
        <Button
          mode="contained-tonal"
          onPress={handleSessionStart}
          style={[styles.reviewBtn, { backgroundColor: theme.colors.onPrimaryContainer }]}
          textColor={theme.colors.onPrimary}
          icon="play"
        >
          Start
        </Button>
      </View>
    );
  };

  return (
    <View>
      {renderHeaderSection()}

      {renderMainSection()}
    </View>
  );
}

const styles = StyleSheet.create({
  settingToggler: {
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  segmentedButtons: {
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  reviewBtn: {
    marginTop: 12,
    borderRadius: 8,
  },
  sessionBtn: {
    borderRadius: 8,
  },
});
