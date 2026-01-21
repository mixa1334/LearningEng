import TouchableTextInput from "@/src/components/common/TouchableTextInput";
import { Category, Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { sendUserImportantConfirmation } from "@/src/util/userAlerts";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "../../common/LanguageProvider";
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
  const { text } = useLanguageContext();

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendUserImportantConfirmation(
      text("common_action_permanent_title"),
      text("vocabulary_delete_word_confirm_message"),
      () => {
        removeWord(wordToEdit);
        exit();
      });
  };

  const handleEditWord = () => {
    editWord(wordToEdit);
    exit();
  };

  const selectCategory = (category: Category) => {
    setWordToEdit({ ...wordToEdit, category: category });
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={exit}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={exit} accessibilityRole="button">
          <View style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]} onStartShouldSetResponder={() => true}>
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: theme.colors.onBackground }]}>
                {text("vocabulary_edit_word_title")}
              </Text>
              <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
            </View>

            <View>
              <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
                {text("vocabulary_edit_word_subtitle")}
              </Text>

              <TouchableTextInput
                label={text("vocabulary_english_word_label")}
                initialValue={wordToEdit.word_en}
                onChange={setWordEn}
              />
              <TouchableTextInput
                label={text("vocabulary_russian_word_label")}
                initialValue={wordToEdit.word_ru}
                onChange={setWordRu}
              />
              <TouchableTextInput
                label={text("vocabulary_text_example_label")}
                initialValue={wordToEdit.text_example}
                onChange={setWordTextExample}
              />
              <View style={styles.categoryPickerContainer}>
                <PickCategoryButton category={wordToEdit.category} onSelectCategory={selectCategory} />
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                mode="contained"
                icon="delete"
                textColor={theme.colors.onError}
                style={[styles.destructiveButton, { backgroundColor: theme.colors.error }]}
                onPress={handleDeleteWord}
              >
                {text("vocabulary_edit_word_delete_button")}
              </Button>
              <Button
                mode="contained"
                icon="content-save"
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                textColor={theme.colors.onPrimary}
                onPress={handleEditWord}
              >
                {text("vocabulary_edit_word_update_button")}
              </Button>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
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
  categoryPickerContainer: {
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
});
