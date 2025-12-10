import { useVocabulary } from "@/hooks/useVocabulary";
import { Category } from "@/model/entity/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput, useTheme } from "react-native-paper";
import SimpleEmojiPicker from "../common/SimpleEmojiPicker";

interface EditCategoryDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly category: Category;
}

export default function EditCategoryDialog({ visible, exit, category }: EditCategoryDialogProps) {
  const theme = useTheme();
  const { editCategory } = useVocabulary();
  const [categoryToEdit, setCategoryToEdit] = useState(category);
  useEffect(() => setCategoryToEdit(category), [category]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [editName, setEditName] = useState(false);

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

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={exit} style={{ backgroundColor: theme.colors.secondaryContainer }}>
        <Dialog.Title style={{ color: theme.colors.onBackground }}>Edit category</Dialog.Title>
        <Dialog.Content>
          {editName ? (
          <TextInput
            label="Category name"
            value={categoryToEdit.name}
            onChangeText={setCategoryName}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: theme.colors.surface } }}
            onBlur={() => setEditName(false)}
            autoFocus
          />) : (
            <TouchableOpacity style={[styles.editableField, { backgroundColor: theme.colors.tertiary }]} onPress={() => setEditName(true)}>
            <Text style={[styles.editableLabel, { color: theme.colors.onTertiary }]}>Name</Text>
            <Text style={[styles.editableValue, { color: theme.colors.onTertiary }]} numberOfLines={1}>
              {categoryToEdit.name || "Tap to enter"}
            </Text>
          </TouchableOpacity>
          )}


          {!showEmojiPicker && (
            <Button mode="outlined" icon="emoticon-outline" onPress={() => setShowEmojiPicker(true)} style={{ marginTop: 10 }}>
              {categoryToEdit.icon} Choose emoji
            </Button>
          )}
          {showEmojiPicker && (
            <View style={styles.emojiPickerContainer}>
              <SimpleEmojiPicker
                onEmojiSelected={(emoji) => {
                  setCategoryEmoji(emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={exit} style={styles.actionButton}>
            Close
          </Button>
          <Button mode="contained" onPress={handleEditCategory} style={styles.actionButton}>
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
  emojiPickerContainer: {
    height: 250,
    margin: 10,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
