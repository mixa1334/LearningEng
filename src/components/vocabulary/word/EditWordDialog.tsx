import { Category, Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import PickCategoryButton from "../category/PickCategoryButton";

type EditableField = "en" | "ru" | "example" | null;

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

function EditableField({
  editingField,
  targetField,
  label,
  value,
  onChange,
  onBlur,
  onPress,
}: EditableFieldProps) {
  const theme = useTheme();

  if (editingField === targetField) {
    return (
      <TextInput
        label={label}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        mode="outlined"
        theme={{
          colors: {
            background: theme.colors.surface,
            outline: theme.colors.outlineVariant,
            primary: theme.colors.primary,
          },
        }}
        onBlur={onBlur}
        autoFocus
      />
    );
  }

  return (
    <TouchableRipple
      style={[
        styles.editableField,
        { backgroundColor: theme.colors.secondaryContainer },
      ]}
      borderless={false}
      rippleColor={theme.colors.outlineVariant}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            styles.editableLabel,
            { color: theme.colors.onSecondaryContainer },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.editableValue,
            { color: theme.colors.onSecondaryContainer },
          ]}
          numberOfLines={1}
        >
          {value || "Tap to enter"}
        </Text>
      </View>
    </TouchableRipple>
  );
}

export default function EditWordDialog({
  visible,
  exit,
  word,
}: EditWordDialogProps) {
  const theme = useTheme();
  useEffect(() => setWordToEdit(word), [word]);
  const { editWord, removeWord } = useVocabulary();
  const [wordToEdit, setWordToEdit] = useState(word);
  const [editingField, setEditingField] = useState<EditableField>(null);

  const setWordEn = (text: string) => {
    setWordToEdit({ ...wordToEdit, word_en: text });
  };

  const setWordRu = (text: string) => {
    setWordToEdit({ ...wordToEdit, word_ru: text });
  };

  const setWordTextExample = (text: string) => {
    setWordToEdit({ ...wordToEdit, text_example: text });
  };

  const startEditing = (field: "en" | "ru" | "example") => {
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
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={exit}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.dialog,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              Edit word
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={exit}
              accessibilityLabel="Close dialog"
            />
          </View>

          <View>
            <Text
              style={[styles.subtitle, { color: theme.colors.onBackground }]}
            >
              Tap a field to quickly update any part of the word.
            </Text>

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
              targetField="example"
              label="Text example (optional)"
              value={wordToEdit.text_example}
              onChange={setWordTextExample}
              onBlur={stopEditing}
              onPress={() => startEditing("example")}
            />
            <PickCategoryButton category={wordToEdit.category} onSelectCategory={selectCategory} />
          </View>

          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="delete"
              textColor={theme.colors.onError}
              style={[
                styles.destructiveButton,
                { backgroundColor: theme.colors.error },
              ]}
              onPress={handleDeleteWord}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              icon="content-save"
              style={[
                styles.primaryButton,
                { backgroundColor: theme.colors.primary },
              ]}
              textColor={theme.colors.onPrimary}
              onPress={handleEditWord}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 24,
    padding: 16,
    width: "90%",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  input: {
    marginVertical: 8,
    borderRadius: 12,
  },
  editableField: {
    marginVertical: 6,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    overflow: "hidden",
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
  title: {
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 13,
    opacity: 0.8,
  },
  primaryButton: {
    marginLeft: 8,
  },
  destructiveButton: {
    marginRight: 8,
  },
});
