import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_XL } from "@/src/resources/constants/layout";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { useLanguageContext } from "../common/LanguageProvider";
import { getCardShadow } from "../common/cardShadow";
import { useAppTheme } from "../common/ThemeProvider";

export default function ProgressCard() {
  const { lastLearningDate, learnedToday, reviewedToday } = useUserData();
  const theme = useAppTheme();
  const { text } = useLanguageContext();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant },
        getCardShadow(theme),
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        {text("profile_progress_title")}
      </Text>
      <View style={styles.row}>
        <Text
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          {text("profile_progress_last_learning")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
          {lastLearningDate || "—"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          {text("profile_progress_learned_today")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
          {learnedToday}
        </Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          {text("profile_progress_reviewed_today")}
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
          {reviewedToday}
        </Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
});


