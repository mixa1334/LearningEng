import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

interface LearningTabHeaderProps {
  readonly isLearnTab: boolean;
  readonly onSelectLearn: () => void;
  readonly onSelectReview: () => void;
}

export default function LearningTabHeader({
  isLearnTab,
  onSelectLearn,
  onSelectReview,
}: LearningTabHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors.outline,
          backgroundColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tabButton,
          isLearnTab && {
            borderBottomColor: theme.colors.primary,
            backgroundColor: theme.colors.surface,
          },
        ]}
        onPress={onSelectLearn}
      >
        <Text style={[styles.tabLabel, { color: theme.colors.onSurface }]}>
          Learn
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          !isLearnTab && {
            borderBottomColor: theme.colors.primary,
            backgroundColor: theme.colors.surface,
          },
        ]}
        onPress={onSelectReview}
      >
        <Text style={[styles.tabLabel, { color: theme.colors.onSurface }]}>
          Review
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});


