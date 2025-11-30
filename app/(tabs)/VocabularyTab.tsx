import CategoriesList from "@/components/category/CategoriesList";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import WordsOverview from "@/components/learn/WordsOverview";
import CreateWordDialog from "@/components/word/CreateWordDialog";
import WordsList from "@/components/word/WordsList";
import {
    SPACING_LG,
    SPACING_MD,
    SPACING_SM,
} from "@/resources/constants/layout";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Button, Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Section = "words" | "categories" | "wordsOverview" | null;

export default function VocabularyTab() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = insets.top + SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD;

  const [expandedSection, setExpandedSection] = useState<Section>(null);

  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [onlyUserAddedWords, setOnlyUserAddedWords] = useState(true);

  const toggleWordsSection = () => {
    setExpandedSection(expandedSection === "words" ? null : "words");
  };

  const toggleCategoriesSection = () => {
    setExpandedSection(expandedSection === "categories" ? null : "categories");
  };

  const switchOnlyUserAddedWords = () => {
    const newVal = !onlyUserAddedWords;
    setOnlyUserAddedWords(newVal);
  };

  const toggleWordsOverviewSection = () => {
    setExpandedSection(
      expandedSection === "wordsOverview" ? null : "wordsOverview"
    );
  };

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: theme.colors.background,
          paddingTop: pageTopPadding,
          paddingBottom: pageBottomPadding,
          paddingHorizontal: pageHorizontalPadding,
        },
      ]}
    >
      <Portal>
        {showAddWordModal && (
          <CreateWordDialog
            visible={showAddWordModal}
            exit={() => setShowAddWordModal(false)}
          />
        )}

        {showAddCategoryModal && (
          <CreateCategoryDialog
            visible={showAddCategoryModal}
            exit={() => setShowAddCategoryModal(false)}
          />
        )}
      </Portal>

      {/* Words Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained-tonal"
          onPress={toggleWordsSection}
          style={styles.sectionHeader}
        >
          Words
        </Button>
        {expandedSection === "words" && (
          <View style={styles.sectionContent}>
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowAddWordModal(true)}
              style={styles.addBtn}
            >
              Add Word
            </Button>
            <WordsList />
          </View>
        )}
      </View>

      {/* Categories Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained-tonal"
          onPress={toggleCategoriesSection}
          style={styles.sectionHeader}
        >
          Categories
        </Button>
        {expandedSection === "categories" && (
          <View style={styles.sectionContent}>
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowAddCategoryModal(true)}
              style={styles.addBtn}
            >
              Add Category
            </Button>
            <CategoriesList />
          </View>
        )}
      </View>

      {/* Words overview section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained-tonal"
          onPress={toggleWordsOverviewSection}
          style={styles.sectionHeader}
        >
          Words Overview
        </Button>
        {expandedSection === "wordsOverview" && (
          <View style={styles.sectionContent}>
            <View style={styles.settingRow}>
              <Text style={{ color: theme.colors.onSurface }}>
                Only User Added Words
              </Text>
              <Switch
                value={onlyUserAddedWords}
                onValueChange={switchOnlyUserAddedWords}
              />
            </View>
            <WordsOverview onlyUserAddedWords={onlyUserAddedWords} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING_MD,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionContent: { padding: SPACING_MD },
  addBtn: { marginBottom: SPACING_SM },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
