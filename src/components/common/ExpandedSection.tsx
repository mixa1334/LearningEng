import { SPACING_MD } from "@/src/resources/constants/layout";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAutoScroll } from "./AutoScrollContext";

interface ExpandedSectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly isExpanded: boolean;
  readonly onPress: () => void;
}

export default function ExpandedSection({
  title,
  children,
  isExpanded,
  onPress,
}: ExpandedSectionProps) {
  const { triggerScroll } = useAutoScroll();
  const theme = useTheme();

  const handlePress = () => {
    onPress();
    if (!isExpanded) {
      triggerScroll();
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onPrimary }]}
          >
            {title}
          </Text>
          <Text
            style={[styles.sectionArrow, { color: theme.colors.onPrimary }]}
          >
            {isExpanded ? "▲" : "▼"}
          </Text>
        </View>
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
    marginBottom: SPACING_MD,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionArrow: {
    fontSize: 18,
    fontWeight: "600",
  }
});
