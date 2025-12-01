import { useStatistics } from "@/hooks/useStatistics";
import { useThemeContext } from "@/provider/ThemeProvider";
import { SPACING_MD, SPACING_XL } from "@/resources/constants/layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileTab() {
  const {
    name,
    streak,
    lastLearningDate,
    reviewedToday,
    dailyGoal,
    changeGoal,
    changeName,
    resetUserStats,
    resetWordsProgress
  } = useStatistics();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editableName, setEditableName] = useState(false);
  const { isDark, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = insets.top + SPACING_XL;
  const pageBottomPadding = insets.bottom + SPACING_XL;

  const toggleEditableName = () => setEditableName(!editableName);
  const toggleSettings = () => setSettingsVisible(!settingsVisible);
  const increaseGoal = () => changeGoal(dailyGoal + 1);
  const decreaseGoal = () => {
    const newDailyGoal = dailyGoal - 1;
    if (newDailyGoal > 0) {
      changeGoal(newDailyGoal);
    }
  };

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{
        paddingTop: pageTopPadding,
        paddingBottom: pageBottomPadding,
        paddingHorizontal: pageHorizontalPadding,
      }}
    >
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor:
              (theme.colors as any).primaryContainer ?? theme.colors.surface,
          },
        ]}
      >
        {editableName ? (
          <View style={styles.nameRow}>
            <TextInput
              mode="flat"
              value={name}
              onChangeText={changeName}
              onBlur={toggleEditableName}
              autoFocus
              style={styles.nameInput}
              underlineColor={theme.colors.primary}
              selectionColor={theme.colors.primary}
            />
            <IconButton
              icon="check"
              mode="contained"
              onPress={toggleEditableName}
              style={[
                styles.editBtn,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />
          </View>
        ) : (
          <View style={styles.nameRow}>
            <Text
              variant="headlineSmall"
              style={[styles.name, { color: theme.colors.onPrimaryContainer }]}
            >
              {name}
            </Text>
            <IconButton
              icon="pencil"
              mode="contained"
              onPress={toggleEditableName}
              style={[
                styles.editBtn,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />
          </View>
        )}

        <View style={styles.streakRow}>
          <Ionicons name="flame" size={28} color={theme.colors.primary} />
          <Text
            style={[
              styles.streakText,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {streak} days in a row
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.statsCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Progress
        </Text>
        <View style={styles.statsRow}>
          <Text
            style={[styles.statsText, { color: theme.colors.onSurfaceVariant }]}
          >
            Last learning
          </Text>
          <Text
            style={[styles.statsValue, { color: theme.colors.onSurface }]}
          >
            {lastLearningDate || "—"}
          </Text>
        </View>
        <View style={styles.statsRow}>
          <Text
            style={[styles.statsText, { color: theme.colors.onSurfaceVariant }]}
          >
            Learned today
          </Text>
          <Text
            style={[styles.statsValue, { color: theme.colors.onSurface }]}
          >
            {reviewedToday}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.goalCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Daily goal
        </Text>
        <View style={styles.goalRow}>
          <IconButton
            icon="minus"
            mode="contained"
            style={[
              styles.roundBtn,
              { backgroundColor: theme.colors.background },
            ]}
            onPress={decreaseGoal}
          />
          <Text
            style={[styles.goalText, { color: theme.colors.onSurface }]}
          >
            {dailyGoal} words / day
          </Text>
          <IconButton
            icon="plus"
            mode="contained"
            style={[
              styles.roundBtn,
              { backgroundColor: theme.colors.background },
            ]}
            onPress={increaseGoal}
          />
        </View>
      </View>

      <Button
        mode="contained-tonal"
        icon="cog"
        onPress={toggleSettings}
        style={styles.settingsBtn}
      >
        Settings
      </Button>

      <Portal>
        <Dialog visible={settingsVisible} onDismiss={toggleSettings}>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Content>
            <View style={styles.settingRow}>
              <Text>Dark Theme</Text>
              <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
            <Button
              mode="outlined"
              style={styles.settingBtn}
              onPress={resetUserStats}
            >
              Reset Statistics
            </Button>
            <Button mode="outlined" style={styles.settingBtn} onPress={resetWordsProgress}>
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
            <Button onPress={toggleSettings}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  profileCard: {
    borderRadius: 24,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  name: {
    fontWeight: "700",
    marginRight: 4,
  },
  nameInput: {
    flex: 1,
    marginRight: SPACING_MD,
    fontWeight: "700",
  },
  editBtn: {
    borderRadius: 50,
    margin: 0,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statsText: {
    fontSize: 13,
    fontWeight: "500",
  },
  statsValue: {
    fontSize: 14,
    fontWeight: "600",
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  streakText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  statsCard: {
    borderRadius: 20,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  goalCard: {
    borderRadius: 20,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
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
