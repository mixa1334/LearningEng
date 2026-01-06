import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { CategoryPicker } from "@/src/components/vocabulary/category/CategoryPicker";
import { Category } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function WordFromTranslationModal() {
  const { translation_id, word_en, word_ru } = useLocalSearchParams<{
    translation_id: string;
    word_en: string;
    word_ru: string;
  }>();

  const { addWord } = useVocabulary();

  const { removeTranslation } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const theme = useAppTheme();

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  const handleSaveToVocabulary = () => {
    if (!selectedCategory) return;
    addWord({
      word_en: word_en,
      word_ru: word_ru,
      transcription: "",
      category_id: selectedCategory.id,
      text_example: "",
    });
    removeTranslation(Number.parseInt(translation_id));
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.dialogHeader}>
        <Text style={{ color: theme.colors.onBackground }}>
          Add to vocabulary
        </Text>
      </View>

      <Text
        style={[
          styles.dialogTranslationText,
          { color: theme.colors.onBackground },
        ]}
      >
        {word_en} - {word_ru}
      </Text>

      <Text style={[styles.sectionLabel, { color: theme.colors.onBackground }]}>
        Category
      </Text>
      <Button
        mode="outlined"
        style={styles.categorySelector}
        onPress={() => setShowCategoryPicker(true)}
      >
        {selectedCategory
          ? `${selectedCategory.icon} ${selectedCategory.name}`
          : "Select category"}
      </Button>

      <CategoryPicker
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={handleSelectCategory}
      />

      <Button
        mode="contained"
        icon="content-save"
        onPress={handleSaveToVocabulary}
        disabled={!selectedCategory}
      >
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  dialogTranslationText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionLabel: {
    marginVertical: 8,
    fontWeight: "600",
  },
  categorySelector: {
    marginBottom: 4,
    borderRadius: 8,
  },
});
