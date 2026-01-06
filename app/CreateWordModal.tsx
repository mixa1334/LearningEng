import FieldTextInput from "@/src/components/common/FieldTextInput";
import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function CreateWordModal() {
  const router = useRouter();
  const { addWord } = useVocabulary();
  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
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
      <Text style={styles.subtitle}>Fill in the details of your new vocabulary item.</Text>

      <FieldTextInput label="English word" initialValue={newWordEn} onChangeText={setNewWordEn} />
      <FieldTextInput label="Russian word" initialValue={newWordRu} onChangeText={setNewWordRu} />
      <FieldTextInput label="Text example (optional)" initialValue={newWordTextExample} onChangeText={setNewWordTextExample} />

      <PickCategoryButton category={selectedCategory} onSelectCategory={selectCategory} />

      <Button
        mode="contained"
        icon="plus"
        onPress={handleAddWord}
        style={styles.actionButton}
        disabled={!newWordEn || !newWordRu || !selectedCategory}
      >
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  categoryButton: { marginTop: 4, borderRadius: 999 },
  categoryInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryEmoji: { fontSize: 18 },
  categoryLabel: { fontSize: 14 },
  actionButton: { marginTop: 20 },
});
