import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { getCardShadow } from "./cardShadow";
import { useAppTheme } from "./ThemeProvider";

interface TouchableCardProps {
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly title: string;
  readonly description: string;
  readonly onPress: () => void;
}

export function TouchableCard({ icon, title, description, onPress }: TouchableCardProps) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant },
        getCardShadow(theme),
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.titleRow}>
        <Ionicons name={icon} size={36} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      </View>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  card: {
    borderRadius: 12,
    padding: 30,
    marginBottom: 24,
    gap: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    textAlign: "left",
    fontSize: 14,
  },
});
