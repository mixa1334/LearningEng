import FieldTextInput from "@/src/components/common/FieldTextInput";
import PickEmojiButton from "@/src/components/common/PickEmojiButton";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function CreateCategoryModal() {
  const router = useRouter();
  const { addCategory } = useVocabulary();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState<string | undefined>(undefined);

  const handleAddCategory = () => {
    if (!newCategoryName || !newCategoryEmoji) return;
    addCategory({
      name: newCategoryName,
      icon: newCategoryEmoji,
    });
    setNewCategoryName("");
    setNewCategoryEmoji(undefined);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Group your words with a name and emoji for quick scanning.</Text>
      <FieldTextInput label="Category name" initialValue={newCategoryName} onChangeText={setNewCategoryName} />
      <View style={styles.emojiPickerContainer}>
        <PickEmojiButton emoji={newCategoryEmoji} onSelectEmoji={setNewCategoryEmoji} />
      </View>
      <Button
        mode="contained"
        icon="plus"
        onPress={handleAddCategory}
        style={styles.actionButton}
        disabled={!newCategoryName || !newCategoryEmoji}
      >
        Save
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  actionButton: { marginTop: 20, width: "50%", alignSelf: "center" },
  emojiPickerContainer: { marginTop: 10, marginBottom: 14 },
});
