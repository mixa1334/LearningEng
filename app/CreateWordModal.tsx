import { CategoryPicker } from "@/src/components/vocabulary/category/CategoryPicker";
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
  const [newWordTranscription, setNewWordTranscription] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
    addWord({
      word_en: newWordEn,
      word_ru: newWordRu,
      transcription: newWordTranscription,
      category_id: selectedCategory.id,
      text_example: newWordTextExample,
    });
    setNewWordEn("");
    setNewWordRu("");
    setNewWordTranscription("");
    setNewWordTextExample("");
    setSelectedCategory(null);
    setShowCategoryPicker(false);
    router.back();
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New word</Text>
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
        label="Transcription (optional)"
        value={newWordTranscription}
        onChangeText={setNewWordTranscription}
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

      <Text style={styles.sectionLabel}>Category</Text>
      <Button
        mode="contained-tonal"
        onPress={() => setShowCategoryPicker(true)}
        style={styles.categoryButton}
      >
        <View style={styles.categoryInner}>
          <Text style={styles.categoryEmoji}>
            {selectedCategory?.icon || "📁"}
          </Text>
          <Text style={styles.categoryLabel}>
            {selectedCategory ? selectedCategory.name : "Choose category"}
          </Text>
        </View>
      </Button>

      <CategoryPicker
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={selectCategory}
      />

      <Button
        mode="contained"
        icon="plus"
        onPress={handleAddWord}
        style={styles.actionButton}
      >
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  title: { fontWeight: "700", fontSize: 20 },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  input: { marginVertical: 8, borderRadius: 12 },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 13,
    opacity: 0.9,
  },
  categoryButton: { marginTop: 4, borderRadius: 999 },
  categoryInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryEmoji: { fontSize: 18 },
  categoryLabel: { fontSize: 14 },
  actionButton: { marginTop: 20 },
});
