import CategoriesList from "@/src/components/vocabulary/category/CategoriesList";
import CreateCategoryDialog from "@/src/components/vocabulary/category/CreateCategoryDialog";
import { SPACING_LG, SPACING_MD, SPACING_SM, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoryVocabularyPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT;

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  return (
    <ScrollView
      style={[
        styles.page,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      contentContainerStyle={{
        paddingTop: pageTopPadding,
        paddingBottom: pageBottomPadding,
        paddingHorizontal: pageHorizontalPadding,
      }}
    >
      <CreateCategoryDialog visible={showAddCategoryModal} exit={() => setShowAddCategoryModal(false)} />

      <Button
        icon="plus"
        mode="outlined"
        onPress={() => setShowAddCategoryModal(true)}
        style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
        textColor={theme.colors.onPrimary}
      >
        add new category
      </Button>
      <CategoriesList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  addBtn: { marginBottom: SPACING_SM },
});
