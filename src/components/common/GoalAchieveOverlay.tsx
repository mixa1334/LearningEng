import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_LG, SPACING_XL } from "@/src/resources/constants/layout";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLanguageContext } from "./LanguageProvider";
import { useAppTheme, useThemeContext } from "./ThemeProvider";

export function GoalAchieveOverlay() {
  const { isHihik } = useThemeContext();
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { name, showBanner, hideGoalAchieveBanner } = useUserData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showBanner) {
      setVisible(true);
      hideGoalAchieveBanner();
    }
  }, [showBanner, hideGoalAchieveBanner]);

  if (!visible) return null;

  const trophyAnimation = isHihik
    ? require("@/assets/animations/teddy.json")
    : require("@/assets/animations/trophy_achieved.json");

  return (
    <View style={[styles.overlay, { backgroundColor: isHihik ? theme.colors.primary : theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.congratsTextTitle, { color: isHihik ? theme.colors.onPrimary : theme.colors.onBackground }]}>
          {name}
        </Text>
        <Text style={[styles.congratsTextBody, { color: isHihik ? theme.colors.onPrimary : theme.colors.onBackground }]}>
          {text("goal_overlay_body")}
        </Text>
        <Text style={[styles.congratsTextFooter, { color: isHihik ? theme.colors.onPrimary : theme.colors.onBackground }]}>
          {text("goal_overlay_footer")}
        </Text>
        <LottieView source={trophyAnimation} autoPlay loop={true} resizeMode="contain" style={styles.trophyAchieved} />
      </View>
      <LottieView
        source={require("@/assets/animations/confetti_daily_goal.json")}
        autoPlay
        loop={false}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
        onAnimationFinish={() => setVisible(false)}
      />
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
  congratsTextTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: SPACING_LG,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  congratsTextBody: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: SPACING_LG,
    textAlign: "center",
  },
  congratsTextFooter: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: SPACING_LG,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  trophyAchieved: {
    width: 150,
    height: 150,
  },
});
