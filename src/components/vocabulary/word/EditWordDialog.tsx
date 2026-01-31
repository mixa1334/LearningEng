import TouchableTextInput from "@/src/components/common/TouchableTextInput";
import { Category, Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { userAlerts } from "@/src/util/userAlerts";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import Animated, { ZoomIn } from "react-native-reanimated";

import { useHaptics } from "../../common/HapticsProvider";
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
  const { mediumImpact } = useHaptics();

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
    mediumImpact();
    userAlerts.sendUserImportantConfirmation(
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
    <Modal transparent visible={visible} animationType="fade" onRequestClose={exit}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={exit} accessibilityRole="button">
          <Animated.View 
            entering={ZoomIn.duration(200)}
            style={[styles.dialog, { backgroundColor: theme.colors.surface }]} 
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.headerContainer}>
              <View>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                    {text("vocabulary_edit_word_title")}
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {text("vocabulary_edit_word_subtitle")}
                </Text>
              </View>
              <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
            </View>

            <View style={styles.form}>
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
                mode="contained-tonal"
                textColor={theme.colors.error}
                style={[styles.button, { backgroundColor: theme.colors.errorContainer }]}
                onPress={handleDeleteWord}
                icon="delete"
              >
                {text("vocabulary_edit_word_delete_button")}
              </Button>
              <Button
                mode="contained"
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                textColor={theme.colors.onPrimary}
                onPress={handleEditWord}
                icon="check"
              >
                {text("vocabulary_edit_word_update_button")}
              </Button>
            </View>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 28,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  form: {
      gap: 16,
      marginVertical: 16,
  },
  actions: {
    marginTop: 8,
    flexDirection: "row",
    gap: 12,
  },
  button: {
      flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  categoryPickerContainer: {
    marginTop: 4,
  },
});
