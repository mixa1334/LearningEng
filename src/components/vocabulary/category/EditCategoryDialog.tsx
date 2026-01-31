import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { userAlerts } from "@/src/util/userAlerts";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { useHaptics } from "../../common/HapticsProvider";
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
  const { mediumImpact } = useHaptics();
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
    mediumImpact();
    userAlerts.sendUserImportantConfirmation(
      text("common_action_permanent_title"),
      text("vocabulary_delete_category_confirm_message"),
      () => {
        removeCategory(categoryToEdit);
        exit();
      }
    );
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
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
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

              <View style={styles.emojiContainer}>
                <PickEmojiButton emoji={categoryToEdit?.icon} onSelectEmoji={setCategoryEmoji} />
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                mode="contained-tonal"
                textColor={theme.colors.error}
                style={{ backgroundColor: theme.colors.errorContainer, flex: 1 }}
                onPress={handleDeleteCategory}
                icon="delete"
              >
                {text("vocabulary_edit_category_delete_button")}
              </Button>
              <Button
                mode="contained"
                textColor={theme.colors.onPrimary}
                style={{ backgroundColor: theme.colors.primary, flex: 1 }}
                onPress={handleEditCategory}
                icon="check"
              >
                {text("vocabulary_edit_category_update_button")}
              </Button>
            </View>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
    marginVertical: 16,
  },
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
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  emojiContainer: {
      alignItems: 'center',
      padding: 8,
  }
});
