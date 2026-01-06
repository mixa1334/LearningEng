import { useThemeContext } from "@/src/components/common/ThemeProvider";
import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD, SPACING_XL } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Switch, Text, useTheme } from "react-native-paper";

import { createBackupFileAndShare, restoreFromBackupFileUri } from "@/src/service/backupService";
import { useAppDispatch } from "@/src/store";
import { loadTranslationsThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { initalizeVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import * as DocumentPicker from "expo-document-picker";
import ExpandedCard from "./ExpandedCard";

export default function SettingsCard() {
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useThemeContext();
  const { resetUserStats, resetWordsProgress } = useUserData();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackup = async () => {
    try {
      setIsProcessing(true);
      await createBackupFileAndShare();
    } catch (e) {
      console.error(e);
      Alert.alert("Backup failed", "Could not create backup file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setIsProcessing(true);
      const uri = result.assets[0].uri;
      await restoreFromBackupFileUri(uri);

      await Promise.all([dispatch(loadUserDataThunk()), dispatch(initalizeVocabularyThunk()), dispatch(loadTranslationsThunk())]);

      Alert.alert("Restore completed", "Your data has been restored successfully.");
    } catch (e) {
      console.error(e);
      Alert.alert("Restore failed", e instanceof Error ? e.message : "Could not restore from the selected file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetUserStats = () => {
    Alert.alert("ACTION IS PERMANENT", "Are you sure you want to reset your entire user data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          resetUserStats();
        },
      },
    ]);
  };

  const handleResetVocabularyProgress = () => {
    Alert.alert("ACTION IS PERMANENT", "Are you sure you want to reset your entire vocabulary progress?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          resetWordsProgress();
        },
      },
    ]);
  };

  return (
    <ExpandedCard title="Settings" icon="settings" autoScroll={true} touchableOpacity={1}>
      <View style={{ marginTop: SPACING_MD }}>
        <View style={styles.themeSettingRow}>
          <Text>Dark Theme</Text>
          <Switch value={isDark} onValueChange={toggleTheme} disabled={isProcessing} />
        </View>
        <Button mode="contained" style={styles.settingBtn} onPress={handleBackup} disabled={isProcessing}>
          Backup
        </Button>
        <Button mode="contained" style={styles.settingBtn} onPress={handleRestore} disabled={isProcessing}>
          Restore
        </Button>
        <View style={styles.resetSettingsRow}>
          <Button
            mode="contained"
            style={{ backgroundColor: theme.colors.error }}
            labelStyle={[styles.resetButton, { color: theme.colors.onError }]}
            onPress={handleResetUserStats}
            disabled={isProcessing}
          >
            Reset user data
          </Button>
          <Button
            mode="contained"
            style={{ backgroundColor: theme.colors.error }}
            labelStyle={[styles.resetButton, { color: theme.colors.onError }]}
            onPress={handleResetVocabularyProgress}
            disabled={isProcessing}
          >
            Reset vocabulary
          </Button>
        </View>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  themeSettingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginBottom: 16,
  },
  resetSettingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  resetButton: {
    fontSize: 10,
    fontWeight: "600",
  },
  settingBtn: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  expandIcon: {
    fontSize: 16,
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemText: {
    fontSize: 13,
    fontWeight: "400",
  },
});
