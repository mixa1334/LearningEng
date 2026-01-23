import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import { Category } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";


export default function SaveTranslationPage() {
  const router = useRouter();
  const { text } = useLanguageContext();
  const { translation_id, word_en, word_ru } = useLocalSearchParams<{
    translation_id: string;
    word_en: string;
    word_ru: string;
  }>();

  const { addWord } = useVocabulary();
  const { removeTranslation } = useTranslation();

  const {playActionSuccess} = useSoundPlayer();
  const {mediumImpact} = useHaptics();

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const handleSaveToVocabulary = () => {
    if (!selectedCategory) return;
    playActionSuccess();
    mediumImpact();
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
        {text("vocabulary_save_translation_subtitle")}
      </Text>

      <Text style={styles.translationText}>
        {word_en} - {word_ru}
      </Text>

      <Text style={styles.sectionLabel}>{text("vocabulary_save_translation_section_label")}</Text>
      <PickCategoryButton category={selectedCategory} onSelectCategory={setSelectedCategory} />

      <Button
        mode="contained"
        icon="content-save"
        onPress={handleSaveToVocabulary}
        style={styles.actionButton}
        disabled={!selectedCategory}
      >
        {text("vocabulary_save_translation_save_button")}
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


