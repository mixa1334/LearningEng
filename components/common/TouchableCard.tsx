import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface TouchableCardProps {
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly title: string;
  readonly description: string;
  readonly onPress: () => void;
}

export function TouchableCard({ icon, title, description, onPress }: TouchableCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
});
