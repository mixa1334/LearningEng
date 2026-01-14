import CategoriesList from "@/src/components/vocabulary/category/CategoriesList";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { SPACING_LG, SPACING_MD, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoriesPage() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: SPACING_MD,
        paddingBottom: insets.bottom + TAB_BAR_BASE_HEIGHT,
        paddingHorizontal: SPACING_LG,
      }}
    >
      <CategoriesList />
    </ScrollView>
  );
}
