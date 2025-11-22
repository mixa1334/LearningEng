import { Category, EntityType, Word } from "@/model/entity/types";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

export default function VocabularyTab() {
  // add to form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [expandedSection, setExpandedSection] = useState<
    "words" | "categories" | null
  >("words");

  // Example categories
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Animals", type: EntityType.preloaded, icon: "🐶" },
    { id: 2, name: "Food", type: EntityType.preloaded, icon: "🍎" },
    { id: 3, name: "Travel", type: EntityType.useradd, icon: "✈️" },
  ]);

  // Example words
  const [words, setWords] = useState<Word[]>([
    {
      id: 1,
      word_en: "Dog",
      word_ru: "Собака",
      transcription: "[dɒg]",
      type: EntityType.preloaded,
      learned: false,
      category: categories[0],
      next_review: "2025-11-22",
      priority: 1,
      text_example: "The dog is barking loudly.",
    },
    {
      id: 2,
      word_en: "Apple",
      word_ru: "Яблоко",
      transcription: "[ˈæpl]",
      type: EntityType.preloaded,
      learned: false,
      category: categories[1],
      next_review: "2025-11-22",
      priority: 1,
      text_example: "She ate a red apple.",
    },
    {
      id: 3,
      word_en: "Ticket",
      word_ru: "Билет",
      transcription: "[ˈtɪkɪt]",
      type: EntityType.useradd,
      learned: false,
      category: categories[2],
      next_review: "2025-11-22",
      priority: 2,
      text_example: "I bought a ticket for the flight.",
    },
  ]);

  // Modal state
  const [showWordModal, setShowWordModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Form state (simplified)
  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const toggleSection = (section: "words" | "categories") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDeleteWord = (id: number, type: EntityType) => {
    if (type === EntityType.useradd) {
      setWords(words.filter((w) => w.id !== id));
    }
  };

  const handleDeleteCategory = (id: number, type: EntityType) => {
    if (type === EntityType.useradd) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
    const newWord: Word = {
      id: words.length + 1,
      word_en: newWordEn,
      word_ru: newWordRu,
      transcription: "",
      type: EntityType.useradd,
      learned: false,
      category: selectedCategory, // ✅ use chosen category
      next_review: new Date().toISOString(),
      priority: 1,
      text_example: "",
    };
    setWords([...words, newWord]);
    setNewWordEn("");
    setNewWordRu("");
    setSelectedCategory(null);
    setShowWordModal(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const newCategory: Category = {
      id: categories.length + 1,
      name: newCategoryName,
      type: EntityType.useradd,
      icon: "📘",
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setShowCategoryModal(false);
  };

  return (
    <View style={styles.page}>
      <Portal>
        {/* Word Modal */}
        <Modal
          visible={showWordModal}
          onDismiss={() => setShowWordModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Add New Word</Text>
          <TextInput
            label="English word"
            value={newWordEn}
            onChangeText={setNewWordEn}
            style={styles.input}
          />
          <TextInput
            label="Russian word"
            value={newWordRu}
            onChangeText={setNewWordRu}
            style={styles.input}
          />
          {/* Category Picker */}
          <Text style={{ marginVertical: 8, fontWeight: "600" }}>
            Select Category:
          </Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Button
                mode={
                  selectedCategory?.id === item.id ? "contained" : "outlined"
                }
                style={{ marginVertical: 4 }}
                onPress={() => setSelectedCategory(item)}
              >
                {item.icon} {item.name}
              </Button>
            )}
          />

          <Button mode="contained" onPress={handleAddWord}>
            Add Word
          </Button>
        </Modal>

        {/* Category Modal */}
        <Modal
          visible={showCategoryModal}
          onDismiss={() => setShowCategoryModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Add New Category</Text>
          <TextInput
            label="Category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddCategory}>
            Add Category
          </Button>
        </Modal>
      </Portal>

      {/* Words Section */}
      <View style={styles.section}>
        <Button
          mode="contained-tonal"
          onPress={() => toggleSection("words")}
          style={styles.sectionHeader}
        >
          Words
        </Button>
        {expandedSection === "words" && (
          <View style={styles.sectionContent}>
            <FlatList
              data={words}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.wordText}>
                    {item.word_en} ({item.word_ru}) — {item.category.icon}{" "}
                    {item.category.name}
                  </Text>
                  {item.type === EntityType.useradd && (
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteWord(item.id, item.type)}
                    />
                  )}
                </View>
              )}
            />
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowWordModal(true)}
              style={styles.addBtn}
            >
              Add Word
            </Button>
          </View>
        )}
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Button
          mode="contained-tonal"
          onPress={() => toggleSection("categories")}
          style={styles.sectionHeader}
        >
          Categories
        </Button>
        {expandedSection === "categories" && (
          <View style={styles.sectionContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.wordText}>
                    {item.icon} {item.name}
                  </Text>
                  {item.type === EntityType.useradd && (
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteCategory(item.id, item.type)}
                    />
                  )}
                </View>
              )}
            />
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowCategoryModal(true)}
              style={styles.addBtn}
            >
              Add Category
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f0f0f0", padding: 16 },
  section: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  sectionContent: { padding: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222", // ✅ darker text
  },
  input: {
    marginVertical: 8,
    borderRadius: 12, // ✅ rounded corners
    backgroundColor: "#6d10deff", // optional subtle background
  },

  addBtn: { marginTop: 12 },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
});
