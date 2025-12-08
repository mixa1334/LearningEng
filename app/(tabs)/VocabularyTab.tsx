import CategoriesList from "@/components/category/CategoriesList";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import CreateWordDialog from "@/components/word/CreateWordDialog";
import WordsList from "@/components/word/WordsList";
import { SPACING_LG, SPACING_MD, SPACING_SM, TAB_BAR_BASE_HEIGHT } from "@/resources/constants/layout";
import React, { PropsWithChildren, useState } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Section = "words" | "categories" | "wordsOverview" | null;

interface SectionCardProps extends PropsWithChildren {
  readonly title: string;
  readonly icon: string;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
}

function SectionCard({ title, icon, isExpanded, onToggle, children }: SectionCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Button
        mode="contained-tonal"
        onPress={onToggle}
        style={[styles.sectionHeader, { backgroundColor: theme.colors.primaryContainer }]}
        contentStyle={styles.sectionHeaderContent}
        uppercase={false}
        icon={icon}
      >
        {title}
      </Button>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

export default function VocabularyTab() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = insets.top + SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT;

  const [expandedSection, setExpandedSection] = useState<Section>(null);

  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const listMaxHeight = screenHeight * 0.35;

  const toggleWordsSection = () => {
    setExpandedSection(expandedSection === "words" ? null : "words");
  };

  const toggleCategoriesSection = () => {
    setExpandedSection(expandedSection === "categories" ? null : "categories");
  };

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
        {showAddWordModal && <CreateWordDialog visible={showAddWordModal} exit={() => setShowAddWordModal(false)} />}

        {showAddCategoryModal && (
          <CreateCategoryDialog visible={showAddCategoryModal} exit={() => setShowAddCategoryModal(false)} />
        )}
      </Portal>

      {/* Words Section */}
      <SectionCard
        title="Words"
        icon="book-open-variant"
        isExpanded={expandedSection === "words"}
        onToggle={toggleWordsSection}
      >
        <Button icon="plus" mode="outlined" onPress={() => setShowAddWordModal(true)} style={styles.addBtn}>
          Add Word
        </Button>
        <View style={[styles.listContainer, { maxHeight: listMaxHeight }]}>
          <WordsList />
        </View>
      </SectionCard>

      {/* Categories Section */}
      <SectionCard
        title="Categories"
        icon="shape-outline"
        isExpanded={expandedSection === "categories"}
        onToggle={toggleCategoriesSection}
      >
        <Button icon="plus" mode="outlined" onPress={() => setShowAddCategoryModal(true)} style={styles.addBtn}>
          Add Category
        </Button>
          <CategoriesList />
      </SectionCard>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  section: {
    marginTop: SPACING_MD,
  },
  sectionHeader: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignSelf: "stretch",
    marginHorizontal: SPACING_SM,
    marginTop: SPACING_SM,
    marginBottom: SPACING_SM,
  },
  sectionHeaderContent: {
    justifyContent: "space-between",
  },
  sectionContent: { paddingHorizontal: SPACING_MD, paddingBottom: SPACING_MD },
  addBtn: { marginBottom: SPACING_SM },
  listContainer: {
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
