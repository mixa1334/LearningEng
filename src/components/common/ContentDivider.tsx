import { SPACING_MD } from "@/src/resources/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

interface DividerProps {
  readonly name?: string; // optional section name
}

export default function ContentDivider({ name }: DividerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.line,
          { backgroundColor: theme.colors.outlineVariant ?? theme.colors.outline },
        ]}
      />
      {name ? (
        <View style={styles.labelContainer}>
          <Ionicons
            name="ellipse-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <Text style={[styles.label, { color: theme.colors.primary }]}>
            {name}
          </Text>
          <Ionicons
            name="ellipse-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.icon}
          />
        </View>
      ) : (
        <Ionicons
          name="ellipse-outline"
          size={22}
          color={theme.colors.primary}
          style={styles.icon}
        />
      )}
      <View
        style={[
          styles.line,
          { backgroundColor: theme.colors.outlineVariant ?? theme.colors.outline },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING_MD,
  },
  line: {
    flex: 1,
    height: 2, // thicker line
    borderRadius: 2,
  },
  icon: {
    marginHorizontal: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  label: {
    fontWeight: "700",
    fontSize: 18, // bigger text
    marginHorizontal: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});


