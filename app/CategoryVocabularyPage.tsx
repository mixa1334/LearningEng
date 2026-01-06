import CategoriesList from "@/src/components/vocabulary/category/CategoriesList";
import { SPACING_LG, SPACING_MD, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoryVocabularyPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: SPACING_MD,
        paddingBottom: insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT,
        paddingHorizontal: SPACING_LG,
      }}
    >
      <CategoriesList />
    </ScrollView>
  );
}
