import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "../common/LanguageProvider";
import ExpandedCard from "./ExpandedCard";

export default function FaqCard() {
  const theme = useTheme();
  const { text } = useLanguageContext();

  const FaqItem = ({ title, body }: { title: string, body: string }) => (
      <View style={styles.item}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text style={[styles.itemText, { color: theme.colors.onSurfaceVariant }]}>
            {body}
          </Text>
      </View>
  );

  return (
    <ExpandedCard title={text("faq_title")} icon="help-outline" autoScroll={false} touchableOpacity={0.7}>
      <View style={styles.container}>
        <FaqItem 
            title={text("faq_personal_dashboard_title")} 
            body={text("faq_personal_dashboard_body")} 
        />
        <FaqItem 
            title={text("faq_daily_learning_title")} 
            body={text("faq_daily_learning_body")} 
        />
        <FaqItem 
            title={text("faq_vocabulary_title")} 
            body={text("faq_vocabulary_body")} 
        />
        <FaqItem 
            title={text("faq_translation_title")} 
            body={text("faq_translation_body")} 
        />
        <FaqItem 
            title={text("faq_backup_title")} 
            body={text("faq_backup_body")} 
        />
        <FaqItem 
            title={text("faq_theme_title")} 
            body={text("faq_theme_body")} 
        />
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  container: {
      gap: 20,
      marginTop: 8,
  },
  item: {
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});
