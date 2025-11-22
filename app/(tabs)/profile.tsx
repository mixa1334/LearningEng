import { useThemeContext } from "@/provider/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Switch,
  Text, useTheme
} from "react-native-paper";

export default function ProfileTab() {
  const [dailyGoal, setDailyGoal] = useState(10);
  const [streak, setStreak] = useState(5);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { isDark, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Image source={{ uri: "wasap" }} style={styles.avatar} />

      <Text variant="titleLarge" style={[styles.name, { color: theme.colors.onBackground }]}>
        Mikhail
      </Text>

      <View style={styles.goalRow}>
        <IconButton
          icon="minus"
          mode="contained"
          style={[styles.roundBtn, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
        />
        <Text style={[styles.goalText, { color: theme.colors.onBackground }]}>
          Daily Goal: {dailyGoal} words
        </Text>
        <IconButton
          icon="plus"
          mode="contained"
          style={[styles.roundBtn, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={() => setDailyGoal(dailyGoal + 1)}
        />
      </View>

      <View style={styles.streakRow}>
        <Ionicons name="flame" size={28} color={theme.colors.primary} />
        <Text style={[styles.streakText, { color: theme.colors.onBackground }]}>
          {streak} day streak
        </Text>
      </View>

      <Button
        mode="contained-tonal"
        icon="cog"
        onPress={() => setSettingsVisible(true)}
        style={styles.settingsBtn}
      >
        Settings
      </Button>

      <Portal>
        <Dialog visible={settingsVisible} onDismiss={() => setSettingsVisible(false)}>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Content>
            <View style={styles.settingRow}>
              <Text>Dark Theme</Text>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
            <Button mode="outlined" style={styles.settingBtn}>Reset Statistics</Button>
            <Button mode="outlined" style={styles.settingBtn}>Reset Vocabulary</Button>
            <Button mode="outlined" style={styles.settingBtn}>Backup to File</Button>
            <Button mode="outlined" style={styles.settingBtn}>Restore from File</Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSettingsVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    padding: "20%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    marginBottom: 24,
    fontWeight: "700",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  roundBtn: {
    borderRadius: 50,
  },
  goalText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  streakText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  settingsBtn: {
    marginTop: 12,
  },
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




