import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "./LanguageProvider";

export default function LoadingScreenSpinner() {
  const theme = useTheme();
  const { text, isReady } = useLanguageContext();

  const title = isReady ? text("loading_title") : "Learn English";
  const tagline = isReady ? text("loading_tagline") : "Expand your vocabulary every day";
  const preparing = isReady ? text("loading_preparing") : "Preparing your learning journey...";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text
        style={[
          styles.appName,
          { color: theme.colors.primary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.tagline,
          { color: theme.colors.onBackground },
        ]}
      >
        {tagline}
      </Text>
      <ActivityIndicator
        size="large"
        color={theme.colors.secondary}
        style={styles.spinner}
      />
      <Text
        style={[
          styles.loadingText,
          { color: theme.colors.onBackground },
        ]}
      >
        {preparing}
      </Text>
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
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 12,
  },
  spinner: {
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    opacity: 0.8,
  },
});
