import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper";
import SimpleEmojiPicker from "../common/SimpleEmojiPicker";

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

  const handleDeleteCategory = () => {
    removeCategory(categoryToEdit);
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
            Edit category
          </Dialog.Title>
          <IconButton icon="close" size={24} onPress={exit} accessibilityLabel="Close dialog" />
        </View>
        <Dialog.Content>
          {editName ? (
          <TextInput
            label="Category name"
            value={categoryToEdit.name}
            onChangeText={setCategoryName}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                background: theme.colors.surface,
                outline: theme.colors.outlineVariant,
                primary: theme.colors.primary,
              },
            }}
            onBlur={() => setEditName(false)}
            autoFocus
          />) : (
            <TouchableRipple
              style={[styles.editableField, { backgroundColor: theme.colors.secondaryContainer }]}
              borderless={false}
              rippleColor={theme.colors.outlineVariant}
              onPress={() => setEditName(true)}
            >
              <View>
                <Text style={[styles.editableLabel, { color: theme.colors.onSecondaryContainer }]}>
                  Name
                </Text>
                <Text
                  style={[styles.editableValue, { color: theme.colors.onSecondaryContainer }]}
                  numberOfLines={1}
                >
                  {categoryToEdit.name || "Tap to enter"}
                </Text>
              </View>
            </TouchableRipple>
          )}


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
                <Text style={styles.emojiEmoji}>{categoryToEdit.icon || "🙂"}</Text>
                <Text style={styles.emojiLabel}>Change emoji</Text>
              </View>
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
  input: {
    marginVertical: 8,
    borderRadius: 12,
  },
  emojiPickerContainer: {
    height: 250,
    margin: 10,
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
  primaryButton: {
    marginLeft: 8,
  },
  destructiveButton: {
    marginRight: 8,
  },
  actions: {
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
