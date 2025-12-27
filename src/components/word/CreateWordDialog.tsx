import { useVocabulary } from "@/src/hooks/useVocabulary";
import { Category } from "@/src/model/entity/types";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { CategoryPicker } from "../category/CategoryPicker";

interface CreateWordDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
}

export default function CreateWordDialog({ visible, exit }: CreateWordDialogProps) {
  const theme = useTheme();
  const { addWord } = useVocabulary();
  const [newWordEn, setNewWordEn] = useState("");
  const [newWordRu, setNewWordRu] = useState("");
  const [newWordTranscription, setNewWordTranscription] = useState("");
  const [newWordTextExample, setNewWordTextExample] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={exit} style={{backgroundColor: theme.colors.secondaryContainer}}>
        <Dialog.Title style={{ color: theme.colors.onBackground }}>Add new word</Dialog.Title>
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
          <Text style={[styles.sectionLabel, { color: theme.colors.onBackground }]}>Category</Text>
          <Button mode="outlined" style={styles.categorySelector} onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
            {selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : "Select category"}
          </Button>

          <CategoryPicker
            visible={showCategoryPicker}
            onClose={() => setShowCategoryPicker(false)}
            onSelectCategory={selectCategory}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button mode="text" icon="close" onPress={exit} style={styles.actionButton}>
            Close
          </Button>
          <Button mode="contained" icon="plus" onPress={handleAddWord} style={styles.actionButton}>
            Add
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
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
