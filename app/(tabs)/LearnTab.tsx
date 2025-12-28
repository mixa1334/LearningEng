import ContentDivider from "@/src/components/common/ContentDivider";
import LearningContent from "@/src/components/learn/LearningContent";
import LearningErrorState from "@/src/components/learn/LearningErrorState";
import WordBuildingMode from "@/src/components/learn/WordBuildingMode";
import WordPairsMode from "@/src/components/learn/WordPairsMode";
import WordsOverview from "@/src/components/learn/WordsOverview";
import { useLearningDailySet } from "@/src/hooks/useLearn";
import {
  SPACING_MD,
  SPACING_XXL,
  TAB_BAR_BASE_HEIGHT,
} from "@/src/resources/constants/layout";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LearnTab() {
  const { wordsToReview, wordsToLearn, error, reloadDailySet } =
    useLearningDailySet();

  const [refreshing, setRefreshing] = useState(false);
  const [activeExtraMode, setActiveExtraMode] = useState<
    "quick" | "pairs" | "build" | null
  >(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const contentHorizontalPadding = SPACING_MD;
  const contentTopPadding = SPACING_XXL;
  const contentBottomPadding =
    insets.bottom + SPACING_XXL + TAB_BAR_BASE_HEIGHT;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      reloadDailySet();
      setRefreshing(false);
    }, 200);
  };

  if (error) {
    return <LearningErrorState error={error} onRetry={reloadDailySet} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={[
        styles.page,
        {
          backgroundColor: theme.colors.background,
          paddingTop: contentTopPadding,
          paddingBottom: contentBottomPadding,
          paddingHorizontal: contentHorizontalPadding,
        },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <ContentDivider name="Learning" />
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <LearningContent
          wordsToLearn={wordsToLearn}
          wordsToReview={wordsToReview}
        />
      </View>

      <View style={{ marginTop: SPACING_XXL * 2 }}>
        <ContentDivider name="Practice more" />
      </View>

      {/* Quick review expandable section */}
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setActiveExtraMode((prev) => (prev === "quick" ? null : "quick"))
          }
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onPrimary },
              ]}
            >
              Quick review
            </Text>
            <Text
              style={[
                styles.sectionArrow,
                { color: theme.colors.onPrimary },
              ]}
            >
              {activeExtraMode === "quick" ? "▲" : "▼"}
            </Text>
          </View>
        </TouchableOpacity>
        {activeExtraMode === "quick" && (
          <View style={styles.sectionBody}>
            <WordsOverview />
          </View>
        )}
      </View>

      {/* Word pairs expandable section */}
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setActiveExtraMode((prev) => (prev === "pairs" ? null : "pairs"))
          }
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onPrimary },
              ]}
            >
              Word pairs
            </Text>
            <Text
              style={[
                styles.sectionArrow,
                { color: theme.colors.onPrimary },
              ]}
            >
              {activeExtraMode === "pairs" ? "▲" : "▼"}
            </Text>
          </View>
        </TouchableOpacity>
        {activeExtraMode === "pairs" && (
          <View style={styles.sectionBody}>
            <WordPairsMode />
          </View>
        )}
      </View>

      {/* Build the word expandable section */}
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setActiveExtraMode((prev) => (prev === "build" ? null : "build"))
          }
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onPrimary },
              ]}
            >
              Build the word
            </Text>
            <Text
              style={[
                styles.sectionArrow,
                { color: theme.colors.onPrimary },
              ]}
            >
              {activeExtraMode === "build" ? "▲" : "▼"}
            </Text>
          </View>
        </TouchableOpacity>
        {activeExtraMode === "build" && (
          <View style={styles.sectionBody}>
            <WordBuildingMode />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
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
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
