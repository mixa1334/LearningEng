import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_LG, SPACING_XL } from "@/src/resources/constants/layout";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useAppTheme } from "./ThemeProvider";

export function GoalAchieveOverlay() {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const { name, dailyGoalAchieve } = useUserData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dailyGoalAchieve) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [dailyGoalAchieve]);

  if (!visible) return null;

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: theme.colors.goalAchieveOverlay },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.congratsText, { color: theme.colors.text }]}>
          🎉 {name} 🎉
        </Text>
        <Text style={[styles.congratsText, { color: theme.colors.text }]}>
          You have achieved your daily learning goal!
        </Text>
        <LottieView
          source={require("@/assets/animations/confetti_daily_goal.json")}
          autoPlay
          loop={false}
          style={{ width: width * 0.8, height: height * 0.4 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: SPACING_XL,
    paddingVertical: SPACING_LG,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: SPACING_LG,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
