import { useVocabulary } from "@/hooks/useVocabulary";
import { Category } from "@/model/entity/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { Button, Dialog, TextInput, useTheme } from "react-native-paper";

interface EditCategoryDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
  readonly category: Category;
}

export default function EditCategoryDialog({
  visible,
  exit,
  category,
}: EditCategoryDialogProps) {
  const theme = useTheme();
  const { editCategory } = useVocabulary();
  const [categoryToEdit, setCategoryToEdit] = useState(category);
  useEffect(() => setCategoryToEdit(category), [category]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
    <Dialog visible={visible} onDismiss={exit}>
      <Dialog.Title style={{ color: theme.colors.onBackground }}>
        Edit Category
      </Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Category name"
          value={categoryToEdit.name}
          onChangeText={setCategoryName}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { background: theme.colors.surface } }}
        />
        {!showEmojiPicker && (
          <Button
            onPress={() => setShowEmojiPicker(true)}
            style={{ marginTop: 10 }}
          >
            {categoryToEdit.icon} Choose emoji
          </Button>
        )}
        {showEmojiPicker && (
          <View style={styles.emojiPickerContainer}>
            <EmojiSelector
              onEmojiSelected={(emoji) => {
                setCategoryEmoji(emoji);
                setShowEmojiPicker(false);
              }}
              showSearchBar={true}
              showTabs={true}
              showHistory={true}
              columns={8}
            />
          </View>
        )}
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={exit} style={styles.actionButton}>
          Close
        </Button>
        <Button
          mode="contained"
          onPress={handleEditCategory}
          style={styles.actionButton}
        >
          Save
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
});
