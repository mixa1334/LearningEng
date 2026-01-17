import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "../common/LanguageProvider";
import ExpandedCard from "./ExpandedCard";

export default function FaqCard() {
  const theme = useTheme();
  const { text } = useLanguageContext();

  return (
    <ExpandedCard title={text("faq_title")} icon="help" autoScroll={false} touchableOpacity={0.7}>
      <View>
        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}>
            {text("faq_personal_dashboard_title")}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            {text("faq_personal_dashboard_body")}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}>
            {text("faq_daily_learning_title")}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            {text("faq_daily_learning_body")}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}>
            {text("faq_vocabulary_title")}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            {text("faq_vocabulary_body")}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}>
            {text("faq_translation_title")}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            {text("faq_translation_body")}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}>
            {text("faq_backup_title")}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            {text("faq_backup_body")}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurfaceVariant }]}>
            {text("faq_theme_title")}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
            {text("faq_theme_body")}
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
