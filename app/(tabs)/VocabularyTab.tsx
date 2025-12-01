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
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Button, Portal, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Section = "words" | "categories" | "wordsOverview" | null;

export default function VocabularyTab() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = insets.top + SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD;

  const [expandedSection, setExpandedSection] = useState<Section>(null);

  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [onlyUserAddedWords, setOnlyUserAddedWords] = useState(true);

  const listMaxHeight = screenHeight * 0.35;

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
      <View style={styles.section}>
        <Button
          mode="contained-tonal"
          onPress={toggleWordsSection}
          style={styles.sectionHeader}
          contentStyle={styles.sectionHeaderContent}
          uppercase={false}
          icon="book-open-variant"
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
            <View style={[styles.listContainer, { maxHeight: listMaxHeight }]}>
              <WordsList />
            </View>
          </View>
        )}
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Button
          mode="contained-tonal"
          onPress={toggleCategoriesSection}
          style={styles.sectionHeader}
          contentStyle={styles.sectionHeaderContent}
          uppercase={false}
          icon="shape-outline"
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
            <View style={[styles.listContainer, { maxHeight: listMaxHeight }]}>
              <CategoriesList />
            </View>
          </View>
        )}
      </View>

      {/* Words overview section */}
      <View style={styles.section}>
        <Button
          mode="contained-tonal"
          onPress={toggleWordsOverviewSection}
          style={styles.sectionHeader}
          contentStyle={styles.sectionHeaderContent}
          uppercase={false}
          icon="chart-bar"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING_MD,
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
