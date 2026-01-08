import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD } from "@/src/resources/constants/layout";
import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import sendUserImportantConfirmation from "@/src/util/userConfirmations";
import ExpandedCard from "./ExpandedCard";

export default function ResetProgressCard() {
  const theme = useAppTheme();

  const { resetUserStats, resetWordsProgress, removeUserVocabulary } = useUserData();

  const handleResetUserStats = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    sendUserImportantConfirmation("ACTION IS PERMANENT", "Are you sure you want to reset your entire user data & statistics?", () => {
      resetUserStats();
      Alert.alert("User data & statistics have been reset successfully.");
    });
  };

  const handleResetVocabularyProgress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    sendUserImportantConfirmation("ACTION IS PERMANENT", "Are you sure you want to reset your entire vocabulary statistics?", () => {
      resetWordsProgress();
      Alert.alert("User vocabulary statistics have been reset successfully.");
    });
  };

  const handleRemoveUserVocabulary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    sendUserImportantConfirmation("ACTION IS PERMANENT", "Are you sure you want to REMOVE your entire VOCABULARY (all words & categories)?", () => {
      removeUserVocabulary();
      Alert.alert("User vocabulary (words & categories) has been removed successfully.");
    });
  };

  return (
    <ExpandedCard title="Reset" icon="close" autoScroll={true} touchableOpacity={1}>
      <View style={[styles.resetSettingsRow, { marginTop: SPACING_MD }]}>
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.error }}
          labelStyle={[styles.resetButton, { color: theme.colors.onError }]}
          onPress={handleResetUserStats}
        >
          Reset user data & statistics
        </Button>
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.error }}
          labelStyle={[styles.resetButton, { color: theme.colors.onError }]}
          onPress={handleResetVocabularyProgress}
        >
          Reset vocabulary statistics
        </Button>
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.reject }}
          labelStyle={[styles.resetButton, { color: theme.colors.onAcceptReject }]}
          onPress={handleRemoveUserVocabulary}
        >
          Remove user words & categories
        </Button>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  resetSettingsRow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
  },
  resetButton: {
    width: "80%",
    fontSize: 12,
    fontWeight: "600",
  },
});
