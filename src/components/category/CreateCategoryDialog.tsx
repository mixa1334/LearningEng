import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, TextInput, useTheme } from "react-native-paper";
import SimpleEmojiPicker from "../common/SimpleEmojiPicker";

interface CreateCategoryDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
}

export default function CreateCategoryDialog({ visible, exit }: CreateCategoryDialogProps) {
  const theme = useTheme();
  const { addCategory } = useVocabulary();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    addCategory({
      name: newCategoryName,
      icon: newCategoryEmoji,
    });
    setNewCategoryName("");
    setNewCategoryEmoji("");
    setShowEmojiPicker(false);
    exit();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={exit} style={{ backgroundColor: theme.colors.secondaryContainer }}>
        <Dialog.Title style={{ color: theme.colors.onBackground }}>Add new category</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: theme.colors.surface } }}
          />
          {!showEmojiPicker && (
            <Button mode="outlined" icon="emoticon-outline" onPress={() => setShowEmojiPicker(true)} style={styles.emojiButton}>
              {newCategoryEmoji || "Choose emoji"}
            </Button>
          )}
          {showEmojiPicker && (
            <View style={styles.emojiPickerContainer}>
              <SimpleEmojiPicker
                onEmojiSelected={(emoji) => {
                  setNewCategoryEmoji(emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button mode="text" icon="close" onPress={exit} style={styles.actionButton}>
            Close
          </Button>
          <Button mode="contained" icon="plus" onPress={handleAddCategory} style={styles.actionButton}>
            Add
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
    marginTop: 10,
  },
  emojiButton: {
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 4,
  },
});
