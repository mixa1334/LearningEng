import BuildingFromCharsMode from "@/src/components/learn/practice/mods/BuildingFromCharsMode";
import MatchPairsMode from "@/src/components/learn/practice/mods/MatchPairsMode";
import QuickOverview from "@/src/components/learn/practice/mods/QuickOverview";
import PracticeModeSettings from "@/src/components/learn/practice/PracticeModeSettings";
import PracticeModeWrapper, { PracticeModeChildProps } from "@/src/components/learn/practice/PracticeModeWrapper";
import { usePractice } from "@/src/hooks/usePractice";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

import { useAutoScroll } from "../../common/AutoScrollContext";
import { getCardShadow } from "../../common/cardShadow";
import { useLanguageContext } from "../../common/LanguageProvider";
import { useAppTheme } from "../../common/ThemeProvider";

export enum ExtraMode {
  OVERVIEW = "OVERVIEW",
  PAIRS = "PAIRS",
  BUILDER = "BUILDER",
}

const PracticeModeComponents: Record<
  ExtraMode,
  {
    component: React.ComponentType<PracticeModeChildProps>;
    titleTextKey: string;
    descriptionTextKey: string;
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => boolean;
  }
> = {
  [ExtraMode.OVERVIEW]: {
    component: QuickOverview,
    titleTextKey: "practice_overview_title",
    descriptionTextKey: "practice_overview_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
  [ExtraMode.PAIRS]: {
    component: MatchPairsMode,
    titleTextKey: "practice_pairs_title",
    descriptionTextKey: "practice_pairs_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength >= 2,
  },
  [ExtraMode.BUILDER]: {
    component: BuildingFromCharsMode,
    titleTextKey: "practice_builder_title",
    descriptionTextKey: "practice_builder_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
  },
};

export default function PracticeMain() {
  const { triggerScroll } = useAutoScroll();
  const { resetPracticeSet } = usePractice();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode>(ExtraMode.OVERVIEW);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const ActiveModeComponent = PracticeModeComponents[activeExtraMode].component;
  const activeModeTitleKey = PracticeModeComponents[activeExtraMode].titleTextKey;

  const extraModeLabels = [
    { value: ExtraMode.OVERVIEW, label: text("practice_overview_title") },
    { value: ExtraMode.PAIRS, label: text("practice_pairs_title") },
    { value: ExtraMode.BUILDER, label: text("practice_builder_title") },
  ];

  const handleModeChange = (newMode: ExtraMode) => {
    setIsSessionStarted(false);
    resetPracticeSet();
    setActiveExtraMode(newMode);
    setIsSettingsVisible(false);
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
        <View
          style={[
            styles.topRow,
            { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline },
            getCardShadow(theme),
          ]}
        >
          <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{text(activeModeTitleKey)}</Text>
          <Button
            mode="contained-tonal"
            onPress={handleSessionEnd}
            style={[styles.sessionBtn, { backgroundColor: theme.colors.reject }]}
            textColor={theme.colors.onAcceptReject}
            icon="flag-checkered"
          >
            {text("practice_end_button")}
          </Button>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.topRow,
          { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline },
          getCardShadow(theme),
        ]}
      >
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
      <View style={[styles.centered, { backgroundColor: theme.colors.surfaceVariant }, getCardShadow(theme)]}>
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
          {text(PracticeModeComponents[activeExtraMode].descriptionTextKey)}
        </Text>
        <Button
          mode="contained-tonal"
          onPress={handleSessionStart}
          style={[styles.reviewBtn, { backgroundColor: theme.colors.primary }]}
          textColor={theme.colors.onPrimary}
          icon="play"
        >
          {text("practice_start_button")}
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
    borderRadius: 16,
    borderWidth: 1,
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
    borderRadius: 20,
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
