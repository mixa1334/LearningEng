import FieldTextInput from "@/src/components/common/FieldTextInput";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import PickEmojiButton from "@/src/components/common/PickEmojiButton";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function CreateCategoryPage() {
  const router = useRouter();
  const { text } = useLanguageContext();
  const { addCategory } = useVocabulary();
  const { playActionSuccess } = useSoundPlayer();
  const { mediumImpact } = useHaptics();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState<string | undefined>(undefined);

  const handleAddCategory = () => {
    if (!newCategoryName || !newCategoryEmoji) return;
    playActionSuccess();
    mediumImpact();
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
      <Text style={styles.subtitle}>{text("vocabulary_create_category_subtitle")}</Text>
      <FieldTextInput
        label={text("vocabulary_create_category_name_label")}
        initialValue={newCategoryName}
        onChangeText={setNewCategoryName}
      />
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
        {text("vocabulary_create_category_save_button")}
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


