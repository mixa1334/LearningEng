import CreateWordDialog from "@/components/word/CreateWordDialog";
import WordsList from "@/components/word/WordsList";
import { SPACING_LG, SPACING_MD, SPACING_SM, TAB_BAR_BASE_HEIGHT } from "@/resources/constants/layout";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WordVocabularyPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = insets.top + SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT;

  const [showAddWordModal, setShowAddWordModal] = useState(false);

  const listMaxHeight = screenHeight * 0.35;

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
      <CreateWordDialog visible={showAddWordModal} exit={() => setShowAddWordModal(false)} />

      <Button
        icon="plus"
        mode="outlined"
        onPress={() => setShowAddWordModal(true)}
        style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
        textColor={theme.colors.onPrimary}
      >
        add new word
      </Button>
      <View style={[styles.listContainer, { maxHeight: listMaxHeight }]}>
        <WordsList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  addBtn: { marginBottom: SPACING_SM },
  listContainer: {
    overflow: "hidden",
  },
});
