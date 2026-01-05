import SimpleEmojiPicker from "@/src/components/common/SimpleEmojiPicker";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function CreateCategoryModal() {
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
      <Text style={styles.title}>New category</Text>
      <Text style={styles.subtitle}>
        Group your words with a name and emoji for quick scanning.
      </Text>
      <TextInput
        label="Category name"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        style={styles.input}
        mode="outlined"
      />
      {!showEmojiPicker && (
        <Button
          mode="contained-tonal"
          icon="emoticon-outline"
          onPress={() => setShowEmojiPicker(true)}
          style={styles.emojiButton}
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
      <Button
        mode="contained"
        icon="plus"
        onPress={handleAddCategory}
        style={styles.actionButton}
      >
        Save
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start" },
  title: { fontWeight: "700", fontSize: 20 },
  subtitle: { marginBottom: 12, fontSize: 13, opacity: 0.8 },
  input: { marginVertical: 8, borderRadius: 12 },
  emojiPickerContainer: { height: 250, marginTop: 10 },
  emojiButton: { marginTop: 10, borderRadius: 999 },
  emojiInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  emojiEmoji: { fontSize: 20 },
  emojiLabel: { fontSize: 14, fontWeight: "500" },
  actionButton: { marginTop: 20 },
});
