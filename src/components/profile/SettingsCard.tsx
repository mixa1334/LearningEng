import { useThemeContext } from "@/src/components/common/ThemeProvider";
import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_MD, SPACING_XL } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Switch, Text, useTheme } from "react-native-paper";

import {
  createBackupFileAndShare,
  restoreFromBackupFileUri,
} from "@/src/service/backupService";
import { useAppDispatch } from "@/src/store";
import { loadTranslationsThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { loadVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import * as DocumentPicker from "expo-document-picker";
import ExpandedCard from "./ExpandedCard";

export default function SettingsCard() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

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
      Alert.alert(
        "Backup failed",
        "Could not create backup file. Please try again."
      );
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

      await Promise.all([
        dispatch(loadUserDataThunk() as any),
        dispatch(loadVocabularyThunk() as any),
        dispatch(loadTranslationsThunk() as any),
      ]);

      Alert.alert(
        "Restore completed",
        "Your data has been restored successfully."
      );
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Restore failed",
        e instanceof Error
          ? e.message
          : "Could not restore from the selected file."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ExpandedCard title="Settings" icon="settings" autoScroll={true}>
      <View style={{ marginTop: SPACING_MD }}>
        <View style={styles.settingRow}>
          <Text>Dark Theme</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            disabled={isProcessing}
          />
        </View>
        <Button
          mode="contained"
          style={styles.settingBtn}
          onPress={resetUserStats}
          disabled={isProcessing}
        >
          Reset Statistics
        </Button>
        <Button
          mode="contained"
          style={styles.settingBtn}
          onPress={resetWordsProgress}
          disabled={isProcessing}
        >
          Reset Vocabulary Progress
        </Button>
        <Button
          mode="contained"
          style={styles.settingBtn}
          onPress={handleBackup}
          disabled={isProcessing}
        >
          Backup to File
        </Button>
        <Button
          mode="contained"
          style={styles.settingBtn}
          onPress={handleRestore}
          disabled={isProcessing}
        >
          Restore from File
        </Button>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  settingBtn: {
    marginVertical: 6,
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
