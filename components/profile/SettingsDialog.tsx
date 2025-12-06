import { useThemeContext } from "@/components/common/ThemeProvider";
import { useUserData } from "@/hooks/useUserData";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Switch, Text } from "react-native-paper";

interface SettingsDialogProps {
  readonly visible: boolean;
  readonly onDismiss: () => void;
}

export default function SettingsDialog({ visible, onDismiss }: SettingsDialogProps) {
  const { isDark, toggleTheme } = useThemeContext();
  const { resetUserStats, resetWordsProgress } = useUserData();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Settings</Dialog.Title>
        <Dialog.Content>
          <View style={styles.settingRow}>
            <Text>Dark Theme</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
          <Button mode="outlined" style={styles.settingBtn} onPress={resetUserStats}>
            Reset Statistics
          </Button>
          <Button
            mode="outlined"
            style={styles.settingBtn}
            onPress={resetWordsProgress}
          >
            Reset Vocabulary Progress
          </Button>
          <Button mode="outlined" style={styles.settingBtn}>
            Backup to File
          </Button>
          <Button mode="outlined" style={styles.settingBtn}>
            Restore from File
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
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


