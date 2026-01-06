import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function CreateWordModal() {
  const { addWord } = useVocabulary();
  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    undefined
  );

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
      <Text style={styles.subtitle}>
        Fill in the details of your new vocabulary item.
      </Text>

      <TextInput
        label="English word"
        value={newWordEn}
        onChangeText={setNewWordEn}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Russian word"
        value={newWordRu}
        onChangeText={setNewWordRu}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Text example (optional)"
        value={newWordTextExample}
        onChangeText={setNewWordTextExample}
        style={styles.input}
        mode="outlined"
      />

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
  input: { marginVertical: 8, borderRadius: 12 },
  categoryButton: { marginTop: 4, borderRadius: 999 },
  categoryInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryEmoji: { fontSize: 18 },
  categoryLabel: { fontSize: 14 },
  actionButton: { marginTop: 20 },
});
