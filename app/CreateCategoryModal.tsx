import FieldTextInput from "@/src/components/common/FieldTextInput";
import SimpleEmojiPicker from "@/src/components/common/SimpleEmojiPicker";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function CreateCategoryModal() {
  const router = useRouter();
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
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Group your words with a name and emoji for quick scanning.</Text>
      <FieldTextInput label="Category name" initialValue={newCategoryName} onChangeText={setNewCategoryName} />
      {!showEmojiPicker && (
        <Button
          mode="contained-tonal"
          icon="emoticon-outline"
          onPress={() => setShowEmojiPicker(true)}
          style={styles.emojiButton}
        >
          <View style={styles.emojiInner}>
            <Text style={styles.emojiEmoji}>{newCategoryEmoji || "🙂"}</Text>
            <Text style={styles.emojiLabel}>{newCategoryEmoji ? "Change emoji" : "Choose emoji"}</Text>
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
      <Button mode="contained" icon="plus" onPress={handleAddCategory} style={styles.actionButton}>
        Save
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  emojiPickerContainer: { height: 250, marginTop: 10 },
  emojiButton: { marginTop: 10, borderRadius: 999 },
  emojiInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  emojiEmoji: { fontSize: 20 },
  emojiLabel: { fontSize: 14, fontWeight: "500" },
  actionButton: { marginTop: 20 },
});
