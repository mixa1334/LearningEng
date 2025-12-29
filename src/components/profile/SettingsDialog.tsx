import { useThemeContext } from "@/src/components/common/ThemeProvider";
import { useUserData } from "@/src/hooks/useUserData";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Switch, Text } from "react-native-paper";
import { createBackupFileAndShare, restoreFromBackupFileUri } from "@/src/service/backupService";
import { useAppDispatch } from "@/src/store";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { loadVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import { loadTranslationsThunk } from "@/src/store/slice/translationSlice";
import * as DocumentPicker from "expo-document-picker";

interface SettingsDialogProps {
  readonly visible: boolean;
  readonly onDismiss: () => void;
}

export default function SettingsDialog({ visible, onDismiss }: SettingsDialogProps) {
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

      await Promise.all([
        dispatch(loadUserDataThunk() as any),
        dispatch(loadVocabularyThunk() as any),
        dispatch(loadTranslationsThunk() as any),
      ]);

      Alert.alert("Restore completed", "Your data has been restored successfully.");
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Restore failed",
        e instanceof Error ? e.message : "Could not restore from the selected file."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Settings</Dialog.Title>
        <Dialog.Content>
          <View style={styles.settingRow}>
            <Text>Dark Theme</Text>
            <Switch value={isDark} onValueChange={toggleTheme} disabled={isProcessing} />
          </View>
          <Button
            mode="outlined"
            style={styles.settingBtn}
            onPress={resetUserStats}
            disabled={isProcessing}
          >
            Reset Statistics
          </Button>
          <Button
            mode="outlined"
            style={styles.settingBtn}
            onPress={resetWordsProgress}
            disabled={isProcessing}
          >
            Reset Vocabulary Progress
          </Button>
          <Button
            mode="outlined"
            style={styles.settingBtn}
            onPress={handleBackup}
            disabled={isProcessing}
          >
            Backup to File
          </Button>
          <Button
            mode="outlined"
            style={styles.settingBtn}
            onPress={handleRestore}
            disabled={isProcessing}
          >
            Restore from File
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={isProcessing}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
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
});


