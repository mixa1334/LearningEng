import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD } from "@/src/resources/constants/layout";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import userImportantConfirmation from "@/src/util/userConfirmations";
import ExpandedCard from "./ExpandedCard";

export default function ResetProgressCard() {
  const theme = useAppTheme();

  const { resetUserStats, resetWordsProgress } = useUserData();

  const handleResetUserStats = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    userImportantConfirmation("ACTION IS PERMANENT", "Are you sure you want to reset your entire user data?", () => {
      resetUserStats();
    });
  };

  const handleResetVocabularyProgress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    userImportantConfirmation("ACTION IS PERMANENT", "Are you sure you want to reset your entire vocabulary progress?", () => {
      resetWordsProgress();
    });
  };

  return (
    <ExpandedCard title="Reset Data" icon="delete" autoScroll={true} touchableOpacity={1}>
      <View style={[styles.resetSettingsRow, { marginTop: SPACING_MD }]}>
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.error }}
          labelStyle={[styles.resetButton, { color: theme.colors.onError }]}
          onPress={handleResetUserStats}
        >
          Reset user data
        </Button>
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.error }}
          labelStyle={[styles.resetButton, { color: theme.colors.onError }]}
          onPress={handleResetVocabularyProgress}
        >
          Reset vocabulary
        </Button>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  resetSettingsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
  },
  resetButton: {
    fontSize: 10,
    fontWeight: "600",
  },
});
