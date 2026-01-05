import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { CategoryPicker } from "@/src/components/vocabulary/category/CategoryPicker";
import CreateWordDialog from "@/src/components/vocabulary/word/CreateWordDialog";
import WordsList from "@/src/components/vocabulary/word/WordsList";
import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import {
  SPACING_LG,
  SPACING_MD,
  SPACING_SM,
  TAB_BAR_BASE_HEIGHT,
} from "@/src/resources/constants/layout";
import { WordCriteria } from "@/src/service/wordService";
import { truncate } from "@/src/util/stringHelper";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WordVocabularyPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const {criteriaDto, updateWordCriteria} = useVocabulary();

  const pageHorizontalPadding = SPACING_LG;
  const pageBottomPadding = insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT;

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [searchPattern, setSearchPattern] = useState("");

  useEffect(() => {
    const newCriteria = WordCriteria.fromRedux(criteriaDto);
    newCriteria.appendCategory(selectedCategory);
    newCriteria.appendSearchPattern(searchPattern);
    updateWordCriteria(newCriteria);
  }, [selectedCategory, searchPattern]);

  const clearSearch = () => {
    setSearchPattern("");
    setSelectedCategory(undefined);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Top Navbar */}
      <View
        style={[
          styles.navbar,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.onSurfaceVariant,
          },
        ]}
      >
        <CategoryPicker
          visible={showCategoryPicker}
          onClose={() => setShowCategoryPicker(false)}
          onSelectCategory={handleCategorySelect}
        />
        <IconButton
          icon="close"
          onPress={clearSearch}
          iconColor={theme.colors.error}
          containerColor={theme.colors.onError}
          size={18}
          accessibilityLabel="Clear search"
        />
        <Button
          mode="contained-tonal"
          style={[
            {
              backgroundColor: theme.colors.outline,
            },
          ]}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text
            style={[
              styles.categorySelectorText,
              { color: theme.colors.background },
            ]}
          >
            {selectedCategory
              ? selectedCategory.icon + " " + truncate(selectedCategory.name, 7)
              : "Category"}
          </Text>
        </Button>

        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.colors.onSurface} />
          <TextInput
            placeholder="Search text..."
            value={searchPattern}
            onChangeText={setSearchPattern}
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholderTextColor={theme.colors.onSurface}
          />
        </View>

        <TouchableOpacity onPress={() => setShowAddWordModal(true)}>
          <Ionicons
            name="add-circle-outline"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          // 60 is the height of the navbar
          paddingTop: SPACING_MD + 60,
          paddingBottom: pageBottomPadding,
          paddingHorizontal: pageHorizontalPadding,
        }}
      >
        <CreateWordDialog
          visible={showAddWordModal}
          exit={() => setShowAddWordModal(false)}
        />

        <WordsList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categorySelectorText: {
    fontSize: 13,
    fontWeight: "600",
  },
  container: { flex: 1 },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING_SM,
    borderBottomWidth: 0.5,
    zIndex: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: SPACING_MD,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
  },
});
