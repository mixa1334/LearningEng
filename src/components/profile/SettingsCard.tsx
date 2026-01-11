import { useThemeContext } from "@/src/components/common/ThemeProvider";
import { SPACING_MD } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";

import { createBackupFileAndShare, restoreFromBackupFileUri } from "@/src/service/backupService";
import { useAppDispatch } from "@/src/store";
import { loadDailyWordSetThunk } from "@/src/store/slice/learnSlice";
import { reloadPracticeThunk } from "@/src/store/slice/practiceSlice";
import { loadTranslationsThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { initalizeVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import * as DocumentPicker from "expo-document-picker";
import ExpandedCard from "./ExpandedCard";

export default function SettingsCard() {
  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useThemeContext();
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

      await dispatch(loadUserDataThunk())
        .unwrap()
        .then(() =>
          Promise.all([
            dispatch(loadDailyWordSetThunk()).unwrap(),
            dispatch(loadTranslationsThunk()).unwrap(),
            dispatch(initalizeVocabularyThunk()).unwrap(),
            dispatch(reloadPracticeThunk()).unwrap(),
          ])
        );

      Alert.alert("Restore completed", "Your data has been restored successfully.");
    } catch (e) {
      console.error(e);
      Alert.alert("Restore failed", e instanceof Error ? e.message : "Could not restore from the selected file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ExpandedCard title="Settings" icon="settings" autoScroll={true} touchableOpacity={1}>
      <View style={{ marginTop: SPACING_MD }}>
        <View style={styles.themeSettingRow}>
          <Text>Dark Theme</Text>
          <Switch value={isDark} onValueChange={toggleTheme} disabled={isProcessing} />
        </View>
        <View style={styles.backupRestoreRow}>
          <Button mode="contained" style={styles.settingBtn} onPress={handleBackup} disabled={isProcessing}>
            Backup
          </Button>
          <Button mode="contained" style={styles.settingBtn} onPress={handleRestore} disabled={isProcessing}>
            Restore
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
    width: "100%",
  },
  backupRestoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  settingBtn: {
    marginVertical: 8,
    width: "50%",
  },
});
