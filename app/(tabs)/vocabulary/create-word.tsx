import FieldTextInput from "@/src/components/common/FieldTextInput";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function CreateWordPage() {
  const router = useRouter();
  const { text } = useLanguageContext();
  const { addWord } = useVocabulary();
  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const { playActionSuccess } = useSoundPlayer();
  const { mediumImpact } = useHaptics();

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
    playActionSuccess();
    mediumImpact();
    addWord({
      word_en: newWordEn,
      word_ru: newWordRu,
      category_id: selectedCategory.id,
      text_example: newWordTextExample,
    });
    setNewWordEn("");
    setNewWordRu("");
    setNewWordTextExample("");
    setSelectedCategory(undefined);
    router.back();
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{text("vocabulary_create_word_subtitle")}</Text>

      <FieldTextInput
        label={text("vocabulary_english_word_label")}
        initialValue={newWordEn}
        onChangeText={setNewWordEn}
      />
      <FieldTextInput
        label={text("vocabulary_russian_word_label")}
        initialValue={newWordRu}
        onChangeText={setNewWordRu}
      />
      <FieldTextInput
        label={text("vocabulary_text_example_label")}
        initialValue={newWordTextExample}
        onChangeText={setNewWordTextExample}
      />

      <View style={styles.categoryPickerContainer}>
        <PickCategoryButton category={selectedCategory} onSelectCategory={selectCategory} />
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={handleAddWord}
        style={styles.actionButton}
        disabled={!newWordEn || !newWordRu || !selectedCategory}
      >
        {text("vocabulary_create_word_save_button")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  actionButton: { marginTop: 20, width: "50%", alignSelf: "center" },
  categoryPickerContainer: { marginTop: 10, marginBottom: 14, paddingHorizontal: 8 },
});


