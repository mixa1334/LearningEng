import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, Word } from "@/model/entity/types";
import { MAX_SELECT_CATEGORY_HEIGHT } from "@/resources/constants/constants";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
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
  const [editingField, setEditingField] = useState<
    "en" | "ru" | "transcription" | "example" | null
  >(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
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

  const startEditing = (field: "en" | "ru" | "transcription" | "example") => {
    setEditingField(field);
  };

  const stopEditing = () => {
    setEditingField(null);
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
        {editingField === "en" ? (
          <TextInput
            label="English word"
            value={wordToEdit.word_en}
            onChangeText={setWordEn}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: theme.colors.surface } }}
            onBlur={stopEditing}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.editableField,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => startEditing("en")}
          >
            <Text
              style={[
                styles.editableLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              English word
            </Text>
            <Text
              style={[
                styles.editableValue,
                { color: theme.colors.onSurface },
              ]}
              numberOfLines={1}
            >
              {wordToEdit.word_en || "Tap to enter"}
            </Text>
          </TouchableOpacity>
        )}

        {editingField === "ru" ? (
          <TextInput
            label="Russian word"
            value={wordToEdit.word_ru}
            onChangeText={setWordRu}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: theme.colors.surface } }}
            onBlur={stopEditing}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.editableField,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => startEditing("ru")}
          >
            <Text
              style={[
                styles.editableLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Russian word
            </Text>
            <Text
              style={[
                styles.editableValue,
                { color: theme.colors.onSurface },
              ]}
              numberOfLines={1}
            >
              {wordToEdit.word_ru || "Tap to enter"}
            </Text>
          </TouchableOpacity>
        )}

        {editingField === "transcription" ? (
          <TextInput
            label="Transcription (optional)"
            value={wordToEdit.transcription}
            onChangeText={setWordTranscription}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: theme.colors.surface } }}
            onBlur={stopEditing}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.editableField,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => startEditing("transcription")}
          >
            <Text
              style={[
                styles.editableLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Transcription (optional)
            </Text>
            <Text
              style={[
                styles.editableValue,
                { color: theme.colors.onSurface },
              ]}
              numberOfLines={1}
            >
              {wordToEdit.transcription || "Tap to enter"}
            </Text>
          </TouchableOpacity>
        )}

        {editingField === "example" ? (
          <TextInput
            label="Text example (optional)"
            value={wordToEdit.text_example}
            onChangeText={setWordTextExample}
            style={styles.input}
            mode="outlined"
            multiline
            theme={{ colors: { background: theme.colors.surface } }}
            onBlur={stopEditing}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.editableField,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => startEditing("example")}
          >
            <Text
              style={[
                styles.editableLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Text example (optional)
            </Text>
            <Text
              style={[
                styles.editableValue,
                { color: theme.colors.onSurface },
              ]}
              numberOfLines={2}
            >
              {wordToEdit.text_example || "Tap to enter"}
            </Text>
          </TouchableOpacity>
        )}

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
          {wordToEdit.category
            ? `${wordToEdit.category.icon} ${wordToEdit.category.name}`
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
                  wordToEdit.category.id === item.id ? "contained" : "outlined"
                }
                style={styles.categoryBtn}
                onPress={() => {
                  setCategory(item);
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
          mode="outlined"
          icon="delete"
          textColor={theme.colors.error}
          style={styles.actionButton}
          onPress={handleDeleteWord}
        >
          Delete
        </Button>
        <Button
          mode="contained"
          icon="content-save"
          style={styles.actionButton}
          onPress={handleEditWord}
        >
          Save
        </Button>
        <Button
          mode="text"
          icon="close"
          onPress={exit}
          style={styles.actionButton}
        >
          Close
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
  editableField: {
    marginVertical: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editableLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  editableValue: {
    fontSize: 16,
    fontWeight: "500",
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
    marginHorizontal: 8,
  },
});
