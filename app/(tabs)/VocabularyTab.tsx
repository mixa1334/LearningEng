import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, EntityType, Word } from "@/model/entity/types";
import { NewCategoryDto } from "@/model/repository/categoryService";
import { NewWordDto } from "@/model/repository/wordService";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function VocabularyTab() {
  const theme = useTheme();

  const [expandedSection, setExpandedSection] = useState<
    "words" | "categories" | null
  >(null);

  const { words, categories, addWord, addCategory } = useVocabulary();

  const [showWordModal, setShowWordModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEditWordModal, setShowEditWordModal] = useState(false);

  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newWordTranscription, setNewWordTranscription] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [wordToEdit, setWordToEdit] = useState<Word | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("");

  const toggleSection = (section: "words" | "categories") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDeleteWord = () => {
    //todo
  };

  const handleEditWord = () => {
    //todo
  };

  const handleDeleteCategory = (category: Category) => {
    //todo
  };

  const handleEditCategory = () => {
    //todo
  };

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
    const newWord: NewWordDto = {
      word_en: newWordEn,
      word_ru: newWordRu,
      transcription: newWordTranscription,
      category_id: selectedCategory.id,
      text_example: newWordTextExample,
    };
    addWord(newWord);
    setShowWordModal(false);
    setNewWordEn("");
    setNewWordRu("");
    setNewWordTranscription("");
    setNewWordTextExample("");
    setSelectedCategory(null);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const newCategory: NewCategoryDto = {
      name: newCategoryName,
      icon: newCategoryEmoji,
    };
    addCategory(newCategory);
    setShowCategoryModal(false);
    setNewCategoryName("");
    setNewCategoryEmoji("");
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Portal>
        {/* Add Word Dialog */}
        <Dialog
          visible={showWordModal}
          onDismiss={() => setShowWordModal(false)}
        >
          <Dialog.Title style={{ color: theme.colors.onBackground }}>
            Add New Word
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="English word"
              value={newWordEn}
              onChangeText={setNewWordEn}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { background: theme.colors.surface } }}
            />
            <TextInput
              label="Russian word"
              value={newWordRu}
              onChangeText={setNewWordRu}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { background: theme.colors.surface } }}
            />
            <TextInput
              label="Transcription (optional)"
              value={newWordTranscription}
              onChangeText={setNewWordTranscription}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { background: theme.colors.surface } }}
            />
            <TextInput
              label="Text example (optional)"
              value={newWordTextExample}
              onChangeText={setNewWordTextExample}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { background: theme.colors.surface } }}
            />
            <Text
              style={[
                styles.sectionLabel,
                { color: theme.colors.onBackground },
              ]}
            >
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
                  style={styles.categoryBtn}
                  onPress={() => setSelectedCategory(item)}
                >
                  {item.icon} {item.name}
                </Button>
              )}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWordModal(false)}>Close</Button>
            <Button mode="contained" onPress={handleAddWord}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog
          visible={showCategoryModal}
          onDismiss={() => setShowCategoryModal(false)}
        >
          <Dialog.Title style={{ color: theme.colors.onBackground }}>
            Add New Category
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { background: theme.colors.surface } }}
            />
            {!showEmojiPicker && (
              <Button
                onPress={() => setShowEmojiPicker(true)}
                style={{ marginTop: 10 }}
              >
                {newCategoryEmoji} Choose emoji
              </Button>
            )}
            {showEmojiPicker && (
              <View style={styles.emojiPickerContainer}>
                <EmojiSelector
                  onEmojiSelected={(emoji) => {
                    setNewCategoryEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                  showSearchBar={false}
                  showTabs={true}
                  showHistory={true}
                  columns={8}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCategoryModal(false)}>Close</Button>
            <Button mode="contained" onPress={handleAddCategory}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Words Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained-tonal"
          onPress={() => toggleSection("words")}
          style={styles.sectionHeader}
        >
          Words
        </Button>
        {expandedSection === "words" && (
          <View style={styles.sectionContent}>
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowWordModal(true)}
              style={styles.addBtn}
            >
              Add Word
            </Button>
            <FlatList
              data={words}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  {/* <TouchableOpacity
                    style={styles.itemRow}
                    onPress={() => {
                      setWordToEdit(item); // store the word you want to edit
                      setShowEditWordModal(true); // open the edit modal
                    }}
                  > */}
                  <Text
                    style={[
                      styles.wordText,
                      { color: theme.colors.onBackground },
                    ]}
                  >
                    {item.word_en} ({item.word_ru}) — {item.category.icon}{" "}
                    {item.category.name}
                  </Text>
                  {/* </TouchableOpacity> */}
                </View>
              )}
            />
          </View>
        )}
      </View>

      {/* Categories Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained-tonal"
          onPress={() => toggleSection("categories")}
          style={styles.sectionHeader}
        >
          Categories
        </Button>
        {expandedSection === "categories" && (
          <View style={styles.sectionContent}>
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowCategoryModal(true)}
              style={styles.addBtn}
            >
              Add Category
            </Button>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text
                    style={[
                      styles.wordText,
                      { color: theme.colors.onBackground },
                    ]}
                  >
                    {item.icon} {item.name}
                  </Text>
                  {item.type === EntityType.useradd && (
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteCategory(item)}
                    />
                  )}
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: "20%",
    padding: 20,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionContent: { padding: 16 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionLabel: {
    marginVertical: 8,
    fontWeight: "600",
  },
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
  addBtn: { marginBottom: 12 },
  emojiPickerContainer: {
    height: 250,
    margin: 10,
  },

  // new styles for dialog
  // dialogTitle: {
  //   fontWeight: "700",
  // },
  // closeBtn: {
  //   marginRight: 8,
  // },
  // deleteBtn: {
  //   marginLeft: 8,
  //   borderColor: "red",
  // },
});
