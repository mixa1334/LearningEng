import { useAppSelector } from "@/store";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

export function GoalAchieveOverlay() {
  const { width, height } = useWindowDimensions();
  const dailyGoalAchieve = useAppSelector((s) => s.stats.dailyGoalAchieve);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dailyGoalAchieve) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [dailyGoalAchieve]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.congratsText}>🎉 You met your daily goal!</Text>
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
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },
  content: {
    alignItems: "center",
  },
  congratsText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
});
