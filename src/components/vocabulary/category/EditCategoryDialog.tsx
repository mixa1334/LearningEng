import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import sendUserImportantConfirmation from "@/src/util/userConfirmations";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
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
    sendUserImportantConfirmation("ACTION IS PERMANENT", "Are you sure you want to delete this category?", () => {
      removeCategory(categoryToEdit); 
      exit();
    });
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={exit}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>Edit category</Text>
            <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
          </View>
          <View style={styles.form}>
            <TouchableTextInput label="Category name" initialValue={categoryToEdit?.name} onChange={setCategoryName} />

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
              Delete
            </Button>
            <Button
              mode="contained"
              icon="content-save"
              textColor={theme.colors.onPrimary}
              style={{ backgroundColor: theme.colors.primary }}
              onPress={handleEditCategory}
            >
              Update
            </Button>
          </View>
        </View>
      </View>
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
