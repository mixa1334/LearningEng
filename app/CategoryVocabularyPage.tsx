import CategoriesList from "@/components/category/CategoriesList";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import { SPACING_LG, SPACING_MD, SPACING_SM, TAB_BAR_BASE_HEIGHT } from "@/resources/constants/layout";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoryVocabularyPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = insets.top + SPACING_MD;
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
      <Portal>
        <CreateCategoryDialog visible={showAddCategoryModal} exit={() => setShowAddCategoryModal(false)} />
      </Portal>

      <Button icon="plus" mode="outlined" onPress={() => setShowAddCategoryModal(true)} style={styles.addBtn}>
        Add Category
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
