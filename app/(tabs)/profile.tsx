import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Switch,
  Text,
} from "react-native-paper";

export default function ProfileTab() {
  const [dailyGoal, setDailyGoal] = useState(10);
  const [streak, setStreak] = useState(5);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <View style={styles.page}>
      {/* Profile picture */}
      <Image
        source={{ uri: "wasap" }}
        style={styles.avatar}
      />

      {/* Name */}
      <Text variant="titleLarge" style={styles.name}>
        Mikhail
      </Text>

      {/* Daily goal */}
      <View style={styles.goalRow}>
        <IconButton
          icon="minus"
          mode="contained"
          style={styles.roundBtn}
          onPress={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
        />
        <Text style={styles.goalText}>Daily Goal: {dailyGoal} words</Text>
        <IconButton
          icon="plus"
          mode="contained"
          style={styles.roundBtn}
          onPress={() => setDailyGoal(dailyGoal + 1)}
        />
      </View>

      {/* Streak */}
      <View style={styles.streakRow}>
        <Ionicons name="flame" size={28} color="#FF5722" />
        <Text style={styles.streakText}>{streak} day streak</Text>
      </View>

      {/* Settings button */}
      <Button
        mode="contained-tonal"
        icon="cog"
        onPress={() => setSettingsVisible(true)}
        style={styles.settingsBtn}
      >
        Settings
      </Button>

      {/* Settings dialog */}
      <Portal>
        <Dialog visible={settingsVisible} onDismiss={() => setSettingsVisible(false)}>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Content>
            {/* Theme toggle */}
            <View style={styles.settingRow}>
              <Text>Dark Theme</Text>
              <Switch value={darkTheme} onValueChange={setDarkTheme} />
            </View>

            {/* Reset statistics */}
            <Button mode="outlined" style={styles.settingBtn}>
              Reset Statistics
            </Button>

            {/* Reset vocabulary */}
            <Button mode="outlined" style={styles.settingBtn}>
              Reset Vocabulary
            </Button>

            {/* Backup buttons */}
            <Button mode="outlined" style={styles.settingBtn}>
              Backup to File
            </Button>
            <Button mode="outlined" style={styles.settingBtn}>
              Restore from File
            </Button>
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
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    color: "#222",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  roundBtn: {
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  goalText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
    color: "#333",
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



