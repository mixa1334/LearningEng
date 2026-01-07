import TouchableTextInput from "@/src/components/common/TouchableTextInput";
import { Category, Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import PickCategoryButton from "../category/PickCategoryButton";

interface EditWordDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly word: Word;
}

export default function EditWordDialog({ visible, exit, word }: EditWordDialogProps) {
  const theme = useTheme();
  useEffect(() => setWordToEdit(word), [word]);
  const { editWord, removeWord } = useVocabulary();
  const [wordToEdit, setWordToEdit] = useState(word);

  const setWordEn = (text: string) => {
    setWordToEdit({ ...wordToEdit, word_en: text });
  };

  const setWordRu = (text: string) => {
    setWordToEdit({ ...wordToEdit, word_ru: text });  
  };

  const setWordTextExample = (text: string) => {
    setWordToEdit({ ...wordToEdit, text_example: text });
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
    <Modal transparent visible={visible} animationType="fade" onRequestClose={exit}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>Edit word</Text>
            <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
          </View>

          <View>
            <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
              Tap a field to quickly update any part of the word.
            </Text>

            <TouchableTextInput
              label="English word"
              initialValue={wordToEdit.word_en}
              onChange={setWordEn}
            />
            <TouchableTextInput
              label="Russian word"
              initialValue={wordToEdit.word_ru}
              onChange={setWordRu}
            />
            <TouchableTextInput
              label="Text example (optional)"
              initialValue={wordToEdit.text_example}
              onChange={setWordTextExample}
            />
            <PickCategoryButton category={wordToEdit.category} onSelectCategory={selectCategory} />
          </View>

          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="delete"
              textColor={theme.colors.onError}
              style={[styles.destructiveButton, { backgroundColor: theme.colors.error }]}
              onPress={handleDeleteWord}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              icon="content-save"
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
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
  actions: {
    marginTop: 20,
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
