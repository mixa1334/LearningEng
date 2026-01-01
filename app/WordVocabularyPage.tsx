import CreateWordDialog from "@/src/components/vocabulary/word/CreateWordDialog";
import WordsList from "@/src/components/vocabulary/word/WordsList";
import {
  SPACING_LG,
  SPACING_MD,
  SPACING_SM,
  TAB_BAR_BASE_HEIGHT,
} from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WordVocabularyPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT;

  const [showAddWordModal, setShowAddWordModal] = useState(false);

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
      <CreateWordDialog
        visible={showAddWordModal}
        exit={() => setShowAddWordModal(false)}
      />

      <Button
        icon="plus"
        mode="outlined"
        onPress={() => setShowAddWordModal(true)}
        style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
        textColor={theme.colors.onPrimary}
      >
        add new word
      </Button>
      <WordsList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  addBtn: { marginBottom: SPACING_SM },
});
