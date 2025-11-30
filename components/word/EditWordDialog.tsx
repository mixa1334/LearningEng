import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, Word } from "@/model/entity/types";
import { MAX_SELECT_CATEGORY_HEIGHT } from "@/resources/constants/constants";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Dialog, Text, TextInput, useTheme } from "react-native-paper";

interface EditWordDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly word: Word;
}

export default function EditWordDialog({
  visible,
  exit,
  word,
}: EditWordDialogProps) {
  const theme = useTheme();
  const { categories, editWord, removeWord } = useVocabulary();
  const [wordToEdit, setWordToEdit] = useState(word);
  useEffect(() => setWordToEdit(word), [word]);

  const setWordEn = (text: string) => {
    setWordToEdit({ ...wordToEdit, word_en: text });
  };

  const setWordRu = (text: string) => {
    setWordToEdit({ ...wordToEdit, word_ru: text });
  };

  const setWordTranscription = (text: string) => {
    setWordToEdit({ ...wordToEdit, transcription: text });
  };

  const setWordTextExample = (text: string) => {
    setWordToEdit({ ...wordToEdit, text_example: text });
  };

  const setCategory = (category: Category) => {
    setWordToEdit({ ...wordToEdit, category: category });
  };

  const handleDeleteWord = () => {
    removeWord(wordToEdit);
    exit();
  };

  const handleEditWord = () => {
    editWord(wordToEdit);
    exit();
  };

  return (
    <Dialog visible={visible} onDismiss={exit}>
      <Dialog.Title style={{ color: theme.colors.onBackground }}>
        Edit Word
      </Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="English word"
          value={wordToEdit.word_en}
          onChangeText={setWordEn}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { background: theme.colors.surface } }}
        />
        <TextInput
          label="Russian word"
          value={wordToEdit.word_ru}
          onChangeText={setWordRu}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { background: theme.colors.surface } }}
        />
        <TextInput
          label="Transcription (optional)"
          value={wordToEdit.transcription}
          onChangeText={setWordTranscription}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { background: theme.colors.surface } }}
        />
        <TextInput
          label="Text example (optional)"
          value={wordToEdit.text_example}
          onChangeText={setWordTextExample}
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
            height: MAX_SELECT_CATEGORY_HEIGHT,
          }}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Button
              mode={
                wordToEdit.category.id === item.id ? "contained" : "outlined"
              }
              style={styles.categoryBtn}
              onPress={() => setCategory(item)}
            >
              {item.icon} {item.name}
            </Button>
          )}
        />
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleDeleteWord}
          style={styles.actionButton}
        >
          Delete
        </Button>
        <Button onPress={exit} style={styles.actionButton}>
          Close
        </Button>
        <Button
          mode="contained"
          onPress={handleEditWord}
          style={styles.actionButton}
        >
          Save
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 8,
  },
});
