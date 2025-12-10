import { useUserData } from "@/hooks/useUserData";
import { SPACING_XL } from "@/resources/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

export default function DailyGoalCard() {
  const { dailyGoal, dailyGoalAchieve, changeGoal } = useUserData();
  const theme = useTheme();

  const backgroundColor = dailyGoalAchieve ? theme.colors.primary : theme.colors.surfaceVariant;
  const textColor = dailyGoalAchieve ? theme.colors.onPrimary : theme.colors.onSurface;

  const increaseGoal = () => changeGoal(dailyGoal + 1);
  const decreaseGoal = () => {
    const newDailyGoal = dailyGoal - 1;
    if (newDailyGoal > 0) {
      changeGoal(newDailyGoal);
    }
  };

  return (
    <View
      style={[styles.card, { backgroundColor: backgroundColor }]}
    >
      <View style={styles.titleRow}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Daily goal
        </Text>
        {dailyGoalAchieve && (
          <Ionicons name="star" size={20} color="gold" />
        )}
      </View>
      <View style={styles.row}>
        <IconButton
          icon="minus"
          mode="contained"
          style={[
            styles.roundBtn,
            { backgroundColor: theme.colors.background },
          ]}
          onPress={decreaseGoal}
        />
        <Text style={[styles.goalText, { color: textColor }]}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
