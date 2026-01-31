import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD } from "@/src/resources/constants/layout";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { userAlerts } from "@/src/util/userAlerts";
import { useHaptics } from "../common/HapticsProvider";
import { useLanguageContext } from "../common/LanguageProvider";
import ExpandedCard from "./ExpandedCard";


export default function ResetProgressCard() {
  const theme = useAppTheme();
  const { text } = useLanguageContext();

  const { resetUserStats, resetWordsProgress, removeUserVocabulary } = useUserData();
  const { heavyImpact } = useHaptics();

  const handleResetUserStats = () => {
    heavyImpact();
    userAlerts.sendUserImportantConfirmation(
      text("common_action_permanent_title"),
      text("reset_user_data_confirm_message"),
      () => {
        resetUserStats();
        userAlerts.sendUserAlert(text("reset_user_data_success"));
      }
    );
  };

  const handleResetVocabularyProgress = () => {
    heavyImpact();
    userAlerts.sendUserImportantConfirmation(
      text("common_action_permanent_title"),
      text("reset_vocabulary_stats_confirm_message"),
      () => {
        resetWordsProgress();
        userAlerts.sendUserAlert(text("reset_vocabulary_stats_success"));
      }
    );
  };

  const handleRemoveUserVocabulary = () => {
    heavyImpact();
    userAlerts.sendUserImportantConfirmation(
      text("common_action_permanent_title"),
      text("reset_remove_vocabulary_confirm_message"),
      () => {
        removeUserVocabulary();
        userAlerts.sendUserAlert(text("reset_remove_vocabulary_success"));
      }
    );
  };

  return (
    <ExpandedCard title={text("reset_title")} icon="delete-outline" autoScroll={true} touchableOpacity={1}>
      <View style={[styles.resetSettingsRow, { marginTop: SPACING_MD }]}>
        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          style={styles.resetButton}
          contentStyle={styles.btnContent}
          onPress={handleResetUserStats}
          icon="account-off"
        >
          {text("reset_user_data_button")}
        </Button>
        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          style={styles.resetButton}
          contentStyle={styles.btnContent}
          onPress={handleResetVocabularyProgress}
          icon="school-outline"
        >
          {text("reset_vocabulary_stats_button")}
        </Button>
        <Button
          mode="contained"
          buttonColor={theme.colors.reject}
          textColor={theme.colors.onAcceptReject}
          style={styles.resetButton}
          contentStyle={styles.btnContent}
          onPress={handleRemoveUserVocabulary}
          icon="delete-sweep"
        >
          {text("reset_remove_vocabulary_button")}
        </Button>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  resetSettingsRow: {
    flexDirection: "column",
    gap: 12,
  },
  resetButton: {
    borderRadius: 12,
    width: "100%",
  },
  btnContent: {
      height: 48,
      justifyContent: "flex-start",
  }
});
