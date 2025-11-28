import CategoriesList from "@/components/category/CategoriesList";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import CreateWordDialog from "@/components/word/CreateWordDialog";
import WordsList from "@/components/word/WordsList";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Portal, useTheme } from "react-native-paper";

type Section = "words" | "categories" | null;

export default function VocabularyTab() {
  const theme = useTheme();

  const [expandedSection, setExpandedSection] = useState<Section>(null);

  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const toggleWordsSection = () => {
    setExpandedSection(expandedSection === "words" ? null : "words");
  };

  const toggleCategoriesSection = () => {
    setExpandedSection(expandedSection === "categories" ? null : "categories");
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: "20%",
    padding: 20,
  },
  section: {
    marginBottom: 16,
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
  sectionContent: { padding: 16 },
  addBtn: { marginBottom: 12 },
});
