import AudioMode from "@/src/components/learn/practice/mods/AudioMode";
import BuildingFromCharsMode from "@/src/components/learn/practice/mods/BuildingFromCharsMode";
import MatchPairsMode from "@/src/components/learn/practice/mods/MatchPairsMode";
import QuickOverview from "@/src/components/learn/practice/mods/QuickOverview";
import PracticeModeSettings from "@/src/components/learn/practice/PracticeModeSettings";
import PracticeModeWrapper, { PracticeModeChildProps } from "@/src/components/learn/practice/PracticeModeWrapper";
import { usePractice } from "@/src/hooks/usePractice";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Animated, { FadeInDown, LinearTransition, SlideInDown, SlideOutDown } from "react-native-reanimated";

import { useAutoScroll } from "../../common/AutoScrollContext";
import { getCardShadow } from "../../common/cardShadow";
import { useHaptics } from "../../common/HapticsProvider";
import { useLanguageContext } from "../../common/LanguageProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import PickCorrectEnglishWordMode from "./mods/PickCorrectEnglishWordMode";

export enum ExtraMode {
  OVERVIEW = "OVERVIEW",
  PAIRS = "PAIRS",
  BUILDER = "BUILDER",
  PICK_ENGLISH = "PICK_ENGLISH",
  AUDIO = "AUDIO",
}

const PracticeModeComponents: Record<
  ExtraMode,
  {
    component: React.ComponentType<PracticeModeChildProps>;
    titleTextKey: string;
    descriptionTextKey: string;
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => boolean;
    icon: keyof typeof MaterialIcons.glyphMap;
  }
> = {
  [ExtraMode.OVERVIEW]: {
    component: QuickOverview,
    titleTextKey: "practice_overview_title",
    descriptionTextKey: "practice_overview_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
    icon: "view-carousel",
  },
  [ExtraMode.PAIRS]: {
    component: MatchPairsMode,
    titleTextKey: "practice_pairs_title",
    descriptionTextKey: "practice_pairs_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength >= 4,
    icon: "style",
  },
  [ExtraMode.BUILDER]: {
    component: BuildingFromCharsMode,
    titleTextKey: "practice_builder_title",
    descriptionTextKey: "practice_builder_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength !== 0,
    icon: "build",
  },
  [ExtraMode.PICK_ENGLISH]: {
    component: PickCorrectEnglishWordMode,
    titleTextKey: "practice_pick_english_title",
    descriptionTextKey: "practice_pick_english_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength > 4,
    icon: "check-circle",
  },
  [ExtraMode.AUDIO]: {
    component: AudioMode,
    titleTextKey: "practice_audio_title",
    descriptionTextKey: "practice_audio_description",
    practiceWordsPoolLengthRule: (wordsPoolLength: number) => wordsPoolLength > 4,
    icon: "headset",
  },
};

export default function PracticeMain() {
  const { triggerScroll } = useAutoScroll();
  const { resetPracticeSet } = usePractice();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { lightImpact } = useHaptics();
  const [activeExtraMode, setActiveExtraMode] = useState<ExtraMode>(ExtraMode.OVERVIEW);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const ActiveModeComponent = PracticeModeComponents[activeExtraMode].component;
  const activeModeTitleKey = PracticeModeComponents[activeExtraMode].titleTextKey;

  const extraModeLabels = [
    { value: ExtraMode.OVERVIEW, key: ExtraMode.OVERVIEW, label: text("practice_overview_title") },
    { value: ExtraMode.PAIRS, key: ExtraMode.PAIRS, label: text("practice_pairs_title") },
    { value: ExtraMode.BUILDER, key: ExtraMode.BUILDER, label: text("practice_builder_title") },
    { value: ExtraMode.PICK_ENGLISH, key: ExtraMode.PICK_ENGLISH, label: text("practice_pick_english_title") },
    { value: ExtraMode.AUDIO, key: ExtraMode.AUDIO, label: text("practice_audio_title") },
  ];

  const handleModeChange = (newMode: ExtraMode) => {
    lightImpact();
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
    lightImpact();
    setIsSettingsVisible((prev) => !prev);
    resetPracticeSet();
    triggerScroll();
  };

  const renderHeaderSection = () => {
    if (isSessionStarted) {
      return (
        <Animated.View
          entering={FadeInDown.springify()}
          layout={LinearTransition.springify()}
          style={[
            styles.topRow,
            { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant },
            getCardShadow(theme),
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
             <MaterialIcons name={PracticeModeComponents[activeExtraMode].icon} size={24} color={theme.colors.primary} />
             <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>{text(activeModeTitleKey)}</Text>
          </View>
          <Button
            mode="contained"
            onPress={handleSessionEnd}
            style={[styles.sessionBtn, { backgroundColor: theme.colors.reject }]}
            textColor={theme.colors.onAcceptReject}
            icon="flag-checkered"
            compact
          >
            {text("practice_end_button")}
          </Button>
        </Animated.View>
      );
    }

    return (
      <Animated.View
         layout={LinearTransition.springify()}
         style={{ marginBottom: 16 }}
      >
        <View style={styles.headerControls}>
             <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.modeScrollContent}
            >
                {extraModeLabels.map((mode) => {
                    const isActive = activeExtraMode === mode.value;
                    return (
                        <Pressable
                            key={mode.key}
                            onPress={() => handleModeChange(mode.value as ExtraMode)}
                            style={[
                                styles.modeChip,
                                { 
                                    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                                    borderColor: isActive ? theme.colors.primary : theme.colors.outlineVariant,
                                }
                            ]}
                        >
                            <Text style={[
                                styles.modeChipLabel,
                                { color: isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }
                            ]}>
                                {mode.label}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
            <Pressable
                onPress={handleSettingsToggler}
                style={({ pressed }) => [
                    styles.settingToggler,
                    {
                    backgroundColor: isSettingsVisible ? theme.colors.primaryContainer : theme.colors.surface,
                    opacity: pressed ? 0.8 : 1,
                    },
                ]}
            >
                <MaterialIcons name="tune" size={24} color={isSettingsVisible ? theme.colors.onPrimaryContainer : theme.colors.onSurface} />
            </Pressable>
        </View>
      </Animated.View>
    );
  };

  const renderMainSection = () => {
    if (isSettingsVisible) {
      return (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
             <PracticeModeSettings />
        </Animated.View>
      );
    }
    if (isSessionStarted) {
      return (
        <PracticeModeWrapper practiceWordsPoolLengthRule={PracticeModeComponents[activeExtraMode].practiceWordsPoolLengthRule}>
          <ActiveModeComponent />
        </PracticeModeWrapper>
      );
    }
    return (
      <Animated.View 
        key={theme.colors.surfaceVariant}
        entering={FadeInDown.delay(100).springify()}
        style={[styles.centered, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }, getCardShadow(theme)]}
      >
        <MaterialIcons 
            name={PracticeModeComponents[activeExtraMode].icon} 
            size={48} 
            color={theme.colors.primary} 
            style={{ marginBottom: 16, opacity: 0.8 }}
        />
        <Text style={[styles.infoText, { color: theme.colors.onSurface }]}>
          {text(PracticeModeComponents[activeExtraMode].descriptionTextKey)}
        </Text>
        <Button
          mode="contained"
          onPress={handleSessionStart}
          style={[styles.reviewBtn, { backgroundColor: theme.colors.primary }]}
          textColor={theme.colors.onPrimary}
          icon="play"
          contentStyle={{ height: 48 }}
        >
          {text("practice_start_button")}
        </Button>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeaderSection()}
      {renderMainSection()}
    </View>
  );
}

const styles = StyleSheet.create({
  headerControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
  },
  modeScrollContent: {
      gap: 8,
      paddingRight: 12,
  },
  modeChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
  },
  modeChipLabel: {
      fontSize: 14,
      fontWeight: "600",
  },
  settingToggler: {
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    borderRadius: 24,
    minHeight: 300,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  reviewBtn: {
    marginTop: 24,
    borderRadius: 12,
    width: "100%",
  },
  sessionBtn: {
    borderRadius: 8,
  },
});
