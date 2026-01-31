import { useUserData } from "@/src/hooks/useUserData";
import { SPACING_XL } from "@/src/resources/constants/layout";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useLanguageContext } from "../common/LanguageProvider";
import { getCardShadow } from "../common/cardShadow";
import { useAppTheme } from "../common/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProgressCard() {
  const { lastLearningDate, learnedToday, reviewedToday } = useUserData();
  const theme = useAppTheme();
  const { text } = useLanguageContext();

  const StatRow = ({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap, label: string, value: string | number }) => (
      <View style={styles.row}>
          <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
                <MaterialIcons name={icon} size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
          </View>
          <Text style={[styles.value, { color: theme.colors.onSurface }]}>{value}</Text>
      </View>
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify()}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant },
        getCardShadow(theme),
      ]}
    >
      <View style={styles.header}>
        <MaterialIcons name="insights" size={20} color={theme.colors.primary} />
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            {text("profile_progress_title")}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <StatRow 
            icon="history" 
            label={text("profile_progress_last_learning")} 
            value={lastLearningDate || "—"} 
        />
        <StatRow 
            icon="school" 
            label={text("profile_progress_learned_today")} 
            value={learnedToday} 
        />
        <StatRow 
            icon="refresh" 
            label={text("profile_progress_reviewed_today")} 
            value={reviewedToday} 
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: SPACING_XL,
    marginBottom: SPACING_XL,
  },
  header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  statsContainer: {
      gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
  },
  iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
});
