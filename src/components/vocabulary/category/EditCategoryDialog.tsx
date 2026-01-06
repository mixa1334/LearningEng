import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import PickEmojiButton from "../../common/PickEmojiButton";
import TouchableTextInput from "../../common/TouchableTextInput";

interface EditCategoryDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly category?: Category;
}

export default function EditCategoryDialog({ visible, exit, category }: EditCategoryDialogProps) {
  const theme = useTheme();
  const { editCategory, removeCategory } = useVocabulary();
  const [categoryToEdit, setCategoryToEdit] = useState(category);
  useEffect(() => setCategoryToEdit(category), [category]);

  const setCategoryName = (text: string) => {
    if (!categoryToEdit) return;
    setCategoryToEdit({ ...categoryToEdit, name: text });
  };

  const setCategoryEmoji = (emoji: string) => {
    if (!categoryToEdit) return;
    setCategoryToEdit({ ...categoryToEdit, icon: emoji });
  };

  const handleEditCategory = () => {
    if (!categoryToEdit) return;
    editCategory(categoryToEdit);
    exit();
  };

  const handleDeleteCategory = () => {
    if (!categoryToEdit) return;
    removeCategory(categoryToEdit);
    exit();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={exit}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>Edit category</Text>
            <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
          </View>
          <View>
            <TouchableTextInput label="Category name" initialValue={categoryToEdit?.name} onChange={setCategoryName} />

            <PickEmojiButton emoji={categoryToEdit?.icon} onSelectEmoji={setCategoryEmoji} />
          </View>

          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="delete"
              textColor={theme.colors.onError}
              style={[styles.destructiveButton, { backgroundColor: theme.colors.error }]}
              onPress={handleDeleteCategory}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              icon="content-save"
              textColor={theme.colors.onPrimary}
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
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
  primaryButton: {
    marginLeft: 8,
  },
  destructiveButton: {
    marginRight: 8,
  },
  actions: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  title: {
    fontWeight: "700",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
