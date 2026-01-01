import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper";
import SimpleEmojiPicker from "../../common/SimpleEmojiPicker";

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
      <Dialog
        visible={visible}
        onDismiss={exit}
        style={[styles.dialog, { backgroundColor: theme.colors.secondaryContainer }]}
      >
        <View style={styles.headerContainer}>
          <Dialog.Title style={[styles.title, { color: theme.colors.onBackground }]}>
            New category
          </Dialog.Title>
          <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
        </View>
        <Dialog.Content>
          <Text style={[styles.subtitle, { color: theme.colors.onBackground }]}>
            Group your words with a name and emoji for quick scanning.
          </Text>

          <TextInput
            label="Category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                background: theme.colors.surface,
                outline: theme.colors.outlineVariant,
                primary: theme.colors.primary,
              },
            }}
          />
          {!showEmojiPicker && (
            <Button
              mode="contained-tonal"
              icon="emoticon-outline"
              onPress={() => setShowEmojiPicker(true)}
              style={[
                styles.emojiButton,
                {
                  backgroundColor: theme.colors.outlineVariant,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
              textColor={theme.colors.onSecondaryContainer}
              contentStyle={styles.emojiButtonContent}
            >
              <View style={styles.emojiInner}>
                <Text style={styles.emojiEmoji}>{newCategoryEmoji || "🙂"}</Text>
                <Text style={styles.emojiLabel}>
                  {newCategoryEmoji ? "Change emoji" : "Choose emoji"}
                </Text>
              </View>
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
          <Button mode="contained" icon="plus" onPress={handleAddCategory} style={styles.actionButton}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 24,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 13,
    opacity: 0.8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
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
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  emojiButtonContent: {
    justifyContent: "center",
  },
  emojiInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emojiEmoji: {
    fontSize: 20,
  },
  emojiLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 4,
  },
});
