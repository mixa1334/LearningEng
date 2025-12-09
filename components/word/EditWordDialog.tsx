import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, Word } from "@/model/entity/types";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { CategoryPicker } from "../category/CategoryPicker";

type EditableField = "en" | "ru" | "transcription" | "example" | null;

interface EditWordDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly word: Word;
}

interface EditableFieldProps {
  readonly editingField: EditableField;
  readonly targetField: EditableField;
  readonly label: string;
  readonly value: any;
  readonly onChange: (text: string) => void;
  readonly onBlur: () => void;
  readonly onPress: () => void;
}

function EditableField({ editingField, targetField, label, value, onChange, onBlur, onPress }: EditableFieldProps) {
  const theme = useTheme();

  if (editingField === targetField) {
    return (
      <TextInput
        label={label}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { background: theme.colors.surface } }}
        onBlur={onBlur}
        autoFocus
      />
    );
  }

  return (
    <TouchableOpacity style={[styles.editableField, { backgroundColor: theme.colors.tertiary }]} onPress={onPress}>
      <Text style={[styles.editableLabel, { color: theme.colors.onTertiary }]}>{label}</Text>
      <Text style={[styles.editableValue, { color: theme.colors.onTertiary }]} numberOfLines={1}>
        {value || "Tap to enter"}
      </Text>
    </TouchableOpacity>
  );
}

export default function EditWordDialog({ visible, exit, word }: EditWordDialogProps) {
  const theme = useTheme();
  useEffect(() => setWordToEdit(word), [word]);
  const { editWord, removeWord } = useVocabulary();
  const [wordToEdit, setWordToEdit] = useState(word);
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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

  const selectCategory = (category: Category) => {
    setWordToEdit({ ...wordToEdit, category: category });
    setShowCategoryPicker(false);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={exit} style={{ backgroundColor: theme.colors.secondaryContainer }}>
        <View style={styles.headerContainer}>
          <Dialog.Title style={{ color: theme.colors.onBackground }}>
            <Text>Edit Word</Text>
          </Dialog.Title>
          <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
        </View>

        <Dialog.Content>
          <EditableField
            editingField={editingField}
            targetField="en"
            label="English word"
            value={wordToEdit.word_en}
            onChange={setWordEn}
            onBlur={stopEditing}
            onPress={() => startEditing("en")}
          />
          <EditableField
            editingField={editingField}
            targetField="ru"
            label="Russian word"
            value={wordToEdit.word_ru}
            onChange={setWordRu}
            onBlur={stopEditing}
            onPress={() => startEditing("ru")}
          />
          <EditableField
            editingField={editingField}
            targetField="transcription"
            label="Transcription (optional)"
            value={wordToEdit.transcription}
            onChange={setWordTranscription}
            onBlur={stopEditing}
            onPress={() => startEditing("transcription")}
          />
          <EditableField
            editingField={editingField}
            targetField="example"
            label="Text example (optional)"
            value={wordToEdit.text_example}
            onChange={setWordTextExample}
            onBlur={stopEditing}
            onPress={() => startEditing("example")}
          />

          <Text style={[styles.sectionLabel, { color: theme.colors.onBackground }]}>Category</Text>
          <Button mode="outlined" style={styles.categorySelector} onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
            {wordToEdit.category ? `${wordToEdit.category.icon} ${wordToEdit.category.name}` : "Select category"}
          </Button>
          <CategoryPicker
            visible={showCategoryPicker}
            onClose={() => setShowCategoryPicker(false)}
            onSelectCategory={selectCategory}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            mode="contained"
            icon="delete"
            textColor={theme.colors.onError}
            style={{ backgroundColor: theme.colors.error }}
            onPress={handleDeleteWord}
          >
            Delete
          </Button>
          <Button
            mode="contained"
            icon="content-save"
            style={{ backgroundColor: theme.colors.primary }}
            textColor={theme.colors.onPrimary}
            onPress={handleEditWord}
          >
            Save
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
