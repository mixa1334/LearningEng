import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import ExpandedCard from "./ExpandedCard";

export default function FaqCard() {
  const theme = useTheme();

  return (
    <ExpandedCard title="FAQ" icon="help" autoScroll={false} touchableOpacity={0.7}>
      <View>
        <View style={styles.item}>
          <Text
            style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Personal dashboard
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            See your streak, daily goal, overall progress, and a motivational
            quote on the profile screen so you always know how you are doing.
          </Text>
        </View>

        <View style={styles.item}>
          <Text
            style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Daily learning & review
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            Get a fresh set of words to learn and review every day on the Learn
            tab, and practice more with quick review, word‑pairs, and
            build‑the‑word training modes.
          </Text>
        </View>

        <View style={styles.item}>
          <Text
            style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Vocabulary & categories
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            Create your own categories with icons, add new words at any time,
            and manage a personal dictionary that tracks your learning progress.
          </Text>
        </View>

        <View style={styles.item}>
          <Text
            style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Translation & history
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            Translate words English ↔ Russian, keep a searchable history of your
            lookups, clear it when you want, and save useful translations
            straight into your vocabulary with a chosen category.
          </Text>
        </View>

        <View style={styles.item}>
          <Text
            style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Backup & restore
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            From Settings you can export all your data (goals, vocabulary,
            categories, and translations) to a backup file and restore it later
            if you switch or reset devices.
          </Text>
        </View>

        <View style={styles.item}>
          <Text
            style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Theme & data reset
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            Switch between light and dark themes, reset statistics, or reset
            vocabulary progress from the Settings dialog when you want a fresh
            start.
          </Text>
        </View>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
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
