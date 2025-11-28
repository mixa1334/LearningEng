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

  const handleAddWord = () => {
    if (!newWordEn || !newWordRu || !selectedCategory) return;
    addWord({
      word_en: newWordEn,
      word_ru: newWordRu,
      transcription: newWordTranscription,
      category_id: selectedCategory.id,
      text_example: newWordTextExample,
    });
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
          Select Category:
        </Text>
        <FlatList
          style={{
            minHeight: MAX_SELECT_CATEGORY_HEIGHT,
          }}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Button
              mode={selectedCategory?.id === item.id ? "contained" : "outlined"}
              style={styles.categoryBtn}
              onPress={() => setSelectedCategory(item)}
            >
              {item.icon} {item.name}
            </Button>
          )}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={exit}>Close</Button>
        <Button mode="contained" onPress={handleAddWord}>
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
});
