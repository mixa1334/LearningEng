import { SPACING_LG, SPACING_XL } from "@/src/resources/constants/layout";
import { useAppSelector } from "@/src/store";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

export function GoalAchieveOverlay() {
  const { width, height } = useWindowDimensions();
  const dailyGoalAchieve = useAppSelector((s) => s.userData.dailyGoalAchieve);
  const name = useAppSelector((s) => s.userData.name);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dailyGoalAchieve) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [dailyGoalAchieve]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.congratsText}>
          🎉 {name}, you met your daily goal!
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
    backgroundColor: "rgba(0,0,0,0.6)",
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
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
