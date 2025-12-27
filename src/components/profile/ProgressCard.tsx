import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_XL } from "@/src/resources/constants/layout";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function ProgressCard() {
  const { lastLearningDate, learnedToday, reviewedToday } = useUserData();
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Progress
      </Text>
      <View style={styles.row}>
        <Text
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          Last learning
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
          {lastLearningDate || "—"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          Learned today
        </Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>
          {learnedToday}
        </Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
        >
          Reviewed today
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


