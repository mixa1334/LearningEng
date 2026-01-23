import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_XL } from "@/src/resources/constants/layout";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

import LottieView from "lottie-react-native";
import { useHaptics } from "../common/HapticsProvider";
import { getCardShadow } from "../common/cardShadow";
import { useLanguageContext } from "../common/LanguageProvider";
import { useAppTheme, useThemeContext } from "../common/ThemeProvider";

export default function DailyGoalCard() {
  const { dailyGoal, dailyGoalAchieve, changeGoal } = useUserData();
  const { isHihik } = useThemeContext();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { mediumImpact } = useHaptics();

  const backgroundColor = dailyGoalAchieve ? theme.colors.primary : theme.colors.surfaceVariant;
  const textColor = dailyGoalAchieve ? theme.colors.onPrimary : theme.colors.onSurface;

  const increaseGoal = () => {
    mediumImpact();
    changeGoal(dailyGoal + 1);
  };
  const decreaseGoal = () => {
    mediumImpact();
    const newDailyGoal = dailyGoal - 1;
    if (newDailyGoal > 0) {
      changeGoal(newDailyGoal);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: backgroundColor }, getCardShadow(theme)]}>
      <View style={styles.titleRow}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{text("profile_daily_goal_title")}</Text>
        {dailyGoalAchieve && (
          <LottieView
            source={isHihik ? require("@/assets/animations/teddy.json") : require("@/assets/animations/trophy_achieved.json")}
            autoPlay
            loop={true}
            resizeMode="contain"
            style={styles.trophyAchieved}
          />
        )}
      </View>
      <View style={styles.row}>
        <IconButton
          icon="minus"
          mode="contained"
          style={[styles.roundBtn, { backgroundColor: theme.colors.background }]}
          onPress={decreaseGoal}
        />
        <Text style={[styles.goalText, { color: textColor }]}>{text("profile_daily_goal_value", { count: dailyGoal })}</Text>
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
  trophyAchieved: {
    width: 50,
    height: 50,
  },
});
