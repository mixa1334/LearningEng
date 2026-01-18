import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import LottieView from "lottie-react-native";
import { useLanguageContext } from "./LanguageProvider";

export default function LoadingScreenSpinner() {
  const theme = useTheme();
  const { text } = useLanguageContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.appName, { color: theme.colors.primary }]}>{text("loading_title")}</Text>
      <Text style={[styles.tagline, { color: theme.colors.onBackground }]}>{text("loading_tagline")}</Text>
      <LottieView
        source={require("@/assets/animations/book_stack.json")}
        autoPlay
        loop={true}
        style={styles.bookStack}
        speed={5}
        resizeMode="contain"
      />
      <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>{text("loading_preparing")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 24,
  },
  appName: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 12,
  },
  bookStack: {
    width: 150,
    height: 150,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    opacity: 0.8,
    textAlign: "center",
  },
});
