import { useUserData } from "@/hooks/useUserData";
import { SPACING_XL } from "@/resources/constants/layout";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

export default function DailyGoalCard() {
  const { dailyGoal, changeGoal } = useUserData();
  const theme = useTheme();

  const increaseGoal = () => changeGoal(dailyGoal + 1);
  const decreaseGoal = () => {
    const newDailyGoal = dailyGoal - 1;
    if (newDailyGoal > 0) {
      changeGoal(newDailyGoal);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Daily goal
      </Text>
      <View style={styles.row}>
        <IconButton
          icon="minus"
          mode="contained"
          style={[styles.roundBtn, { backgroundColor: theme.colors.background }]}
          onPress={decreaseGoal}
        />
        <Text style={[styles.goalText, { color: theme.colors.onSurface }]}>
          {dailyGoal} words / day
        </Text>
        <IconButton
          icon="plus"
          mode="contained"
          style={[styles.roundBtn, { backgroundColor: theme.colors.background }]}
          onPress={increaseGoal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
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
});


