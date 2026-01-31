import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_XL } from "@/src/resources/constants/layout";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";

import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { getCardShadow } from "../common/cardShadow";
import { useHaptics } from "../common/HapticsProvider";
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
    <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={[styles.card, { backgroundColor: backgroundColor }, getCardShadow(theme)]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
            <MaterialIcons name="track-changes" size={20} color={textColor} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>{text("profile_daily_goal_title")}</Text>
        </View>
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
      
      <View style={styles.controlsRow}>
        <Pressable
            onPress={decreaseGoal}
            style={({ pressed }) => [
                styles.controlBtn,
                { backgroundColor: dailyGoalAchieve ? 'rgba(255,255,255,0.2)' : theme.colors.surface },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
            ]}
        >
            <MaterialIcons name="remove" size={24} color={textColor} />
        </Pressable>
        
        <View style={styles.valueContainer}>
            <Text style={[styles.goalValue, { color: textColor }]}>{dailyGoal}</Text>
        </View>

        <Pressable
            onPress={increaseGoal}
            style={({ pressed }) => [
                styles.controlBtn,
                { backgroundColor: dailyGoalAchieve ? 'rgba(255,255,255,0.2)' : theme.colors.surface },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
            ]}
        >
            <MaterialIcons name="add" size={24} color={textColor} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
  },
  titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
      alignItems: "center",
  },
  goalValue: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
  },
  goalLabel: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
  },
  trophyAchieved: {
    width: 40,
    height: 40,
  },
});
