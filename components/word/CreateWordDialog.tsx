import { useVocabulary } from "@/hooks/useVocabulary";
import { Category } from "@/model/entity/types";
import { MAX_SELECT_CATEGORY_HEIGHT } from "@/resources/constants/constants";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Dialog, Text, TextInput, useTheme } from "react-native-paper";

interface CreateWordDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
}

export default function CreateWordDialog({ visible, exit }: CreateWordDialogProps) {
  const theme = useTheme();
  const { categories, addWord } = useVocabulary();
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
    exit();
  };

  return (
    <Dialog visible={visible} onDismiss={exit}>
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
          style={[styles.sectionLabel, { color: theme.colors.onBackground }]}
        >
          Category
        </Text>
        <Button
          mode="outlined"
          style={styles.categorySelector}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          {selectedCategory
            ? `${selectedCategory.icon} ${selectedCategory.name}`
            : "Select category"}
        </Button>
        {showCategoryPicker && (
          <FlatList
            style={{
              height: MAX_SELECT_CATEGORY_HEIGHT,
            }}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Button
                mode={
                  selectedCategory?.id === item.id ? "contained" : "outlined"
                }
                style={styles.categoryBtn}
                onPress={() => {
                  setSelectedCategory(item);
                  setShowCategoryPicker(false);
                }}
              >
                {item.icon} {item.name}
              </Button>
            )}
          />
        )}
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button
          mode="text"
          icon="close"
          onPress={exit}
          style={styles.actionButton}
        >
          Close
        </Button>
        <Button
          mode="contained"
          icon="plus"
          onPress={handleAddWord}
          style={styles.actionButton}
        >
          Add
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    borderRadius: 12,
  },
  categoryBtn: {
    marginVertical: 4,
    borderRadius: 8,
  },
  sectionLabel: {
    marginVertical: 8,
    fontWeight: "600",
  },
  categorySelector: {
    marginBottom: 4,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 4,
  },
});
