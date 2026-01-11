import CategoriesList from "@/src/components/vocabulary/category/CategoriesList";
import { SPACING_LG, SPACING_MD, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoriesPage() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1 }}
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
