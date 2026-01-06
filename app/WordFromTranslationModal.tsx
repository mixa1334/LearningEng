import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import { Category } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function WordFromTranslationModal() {
  const router = useRouter();
  const { translation_id, word_en, word_ru } = useLocalSearchParams<{
    translation_id: string;
    word_en: string;
    word_ru: string;
  }>();

  const { addWord } = useVocabulary();
  const { removeTranslation } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    undefined
  );

  const handleSaveToVocabulary = () => {
    if (!selectedCategory) return;
    addWord({
      word_en: word_en,
      word_ru: word_ru,
      category_id: selectedCategory.id,
      text_example: "",
    });
    removeTranslation(Number.parseInt(translation_id));
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Choose a category for this translation and save it to your vocabulary.
      </Text>

      <Text style={styles.translationText}>
        {word_en} - {word_ru}
      </Text>

      <Text style={styles.sectionLabel}>Category</Text>
      <PickCategoryButton
        category={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <Button
        mode="contained"
        icon="content-save"
        onPress={handleSaveToVocabulary}
        style={styles.actionButton}
        disabled={!selectedCategory}
      >
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  translationText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 13,
    opacity: 0.9,
  },
  actionButton: { marginTop: 20 },
});
