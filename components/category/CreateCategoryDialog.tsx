import { useVocabulary } from "@/hooks/useVocabulary";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { Button, Dialog, TextInput, useTheme } from "react-native-paper";

interface CreateCategoryDialogProps {
  readonly visible: boolean;
  readonly exit: () => void;
}

export default function CreateCategoryDialog({
  visible,
  exit,
}: CreateCategoryDialogProps) {
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
    exit();
  };

  return (
    <Dialog visible={visible} onDismiss={exit}>
      <Dialog.Title style={{ color: theme.colors.onBackground }}>
        Add New Category
      </Dialog.Title>
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
          <Button
            onPress={() => setShowEmojiPicker(true)}
            style={{ marginTop: 10 }}
          >
            {newCategoryEmoji} Choose emoji
          </Button>
        )}
        {showEmojiPicker && (
          <View style={styles.emojiPickerContainer}>
            <EmojiSelector
              onEmojiSelected={(emoji) => {
                setNewCategoryEmoji(emoji);
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
      <Dialog.Actions>
        <Button onPress={exit}>Close</Button>
        <Button mode="contained" onPress={handleAddCategory}>
          Add
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
});
