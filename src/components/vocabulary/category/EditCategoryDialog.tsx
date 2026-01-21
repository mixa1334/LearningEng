import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { sendUserImportantConfirmation } from "@/src/util/userAlerts";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "../../common/LanguageProvider";
import PickEmojiButton from "../../common/PickEmojiButton";
import TouchableTextInput from "../../common/TouchableTextInput";

interface EditCategoryDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly category: Category;
}

export default function EditCategoryDialog({ visible, exit, category }: EditCategoryDialogProps) {
  const theme = useTheme();
  const { editCategory, removeCategory } = useVocabulary();
  const { text } = useLanguageContext();
  const [categoryToEdit, setCategoryToEdit] = useState(category);
  useEffect(() => setCategoryToEdit(category), [category]);

  const setCategoryName = (text: string) => {
    setCategoryToEdit({ ...categoryToEdit, name: text });
  };

  const setCategoryEmoji = (emoji: string) => {
    setCategoryToEdit({ ...categoryToEdit, icon: emoji });
  };

  const handleEditCategory = () => {
    editCategory(categoryToEdit);
    exit();
  };

  const handleDeleteCategory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sendUserImportantConfirmation(
      text("common_action_permanent_title"),
      text("vocabulary_delete_category_confirm_message"),
      () => {
        removeCategory(categoryToEdit);
        exit();
      }
    );
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
                {text("vocabulary_edit_category_title")}
              </Text>
              <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
            </View>
            <View style={styles.form}>
              <TouchableTextInput
                label={text("vocabulary_edit_category_name_label")}
                initialValue={categoryToEdit?.name}
                onChange={setCategoryName}
              />

              <PickEmojiButton emoji={categoryToEdit?.icon} onSelectEmoji={setCategoryEmoji} />
            </View>

            <View style={styles.actions}>
              <Button
                mode="contained"
                icon="delete"
                textColor={theme.colors.onError}
                style={{ backgroundColor: theme.colors.error }}
                onPress={handleDeleteCategory}
              >
                {text("vocabulary_edit_category_delete_button")}
              </Button>
              <Button
                mode="contained"
                icon="content-save"
                textColor={theme.colors.onPrimary}
                style={{ backgroundColor: theme.colors.primary }}
                onPress={handleEditCategory}
              >
                {text("vocabulary_edit_category_update_button")}
              </Button>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    alignItems: "center",
    gap: 10,
  },
  dialog: {
    borderRadius: 24,
    padding: 24,
    width: "80%",
    gap: 30,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
