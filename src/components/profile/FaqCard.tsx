import { SPACING_XL } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function FaqCard() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <Pressable
      onPress={toggleExpanded}
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
    >
      <View>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.onSurface,
                marginBottom: expanded ? 16 : 0,
              },
            ]}
          >
            FAQ
          </Text>
          <Text
            style={[styles.expandIcon, { color: theme.colors.onSurfaceVariant }]}
          >
            {expanded ? "▲" : "▼"}
          </Text>
        </View>

        {expanded && (
          <>
            <View style={styles.item}>
              <Text
                style={[
                  styles.itemTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Personal dashboard
              </Text>
              <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
                See your name, streak and daily goal in one place.
              </Text>
            </View>

            <View style={styles.item}>
              <Text
                style={[
                  styles.itemTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Learning & review
              </Text>
              <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
                Learn new words and quickly review what you already know.
              </Text>
            </View>

            <View style={styles.item}>
              <Text
                style={[
                  styles.itemTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Vocabulary
              </Text>
              <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
                Organize words into categories and edit your own dictionary.
              </Text>
            </View>

            <View style={styles.item}>
              <Text
                style={[
                  styles.itemTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Translation
              </Text>
              <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
                Translate words English ↔ Russian and see your recent history.
              </Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
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
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemText: {
    fontSize: 13,
    fontWeight: "400",
  },
});

