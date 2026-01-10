import { SPACING_XL } from "@/src/resources/constants/layout";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useAutoScroll } from "../common/AutoScrollContext";

interface ExpandedCardProps {
  readonly title: string;
  readonly touchableOpacity: number;
  readonly children: React.ReactNode;
  readonly autoScroll: boolean;
  readonly icon?: keyof typeof MaterialIcons.glyphMap;
}

export default function ExpandedCard({
  title,
  touchableOpacity,
  children,
  autoScroll,
  icon,
}: ExpandedCardProps) {
  const { triggerScroll } = useAutoScroll();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    if (autoScroll) {
      triggerScroll();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={touchableOpacity}
      onPress={toggleExpanded}
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
    >
      <View>
        <View style={[styles.headerRow, { marginBottom: expanded ? 16 : 0 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.onSurface,
                },
              ]}
            >
              {title}
            </Text>
            {icon && (
              <MaterialIcons
                name={icon}
                size={16}
                color={theme.colors.onSurface}
              />
            )}
          </View>
          <Text
            style={[
              styles.expandIcon,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {expanded ? "▲" : "▼"}
          </Text>
        </View>

        {expanded && <>{children}</>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  expandIcon: {
    fontSize: 16,
  },
});
