import { Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getCardShadow } from "../../common/cardShadow";
import { useHaptics } from "../../common/HapticsProvider";
import { useSoundPlayer } from "../../common/SoundProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import EditWordDialog from "./EditWordDialog";

export default function WordsList() {
  const theme = useAppTheme();
  const { words } = useVocabulary();
  const { playTap } = useSoundPlayer();
  const { lightImpact } = useHaptics();

  const [showEditWordModal, setShowEditWordModal] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null);

  const openEditWordModal = (word: Word) => {
    playTap();
    lightImpact();
    setWordToEdit(word);
    setShowEditWordModal(true);
  };

  return (
    <>
      {showEditWordModal && wordToEdit && (
        <EditWordDialog visible={showEditWordModal} exit={() => setShowEditWordModal(false)} word={wordToEdit} />
      )}

      <View style={styles.listContent}>
        {words.map((item) => (
          <Pressable
            key={item.id.toString()}
            style={({ pressed }) => [
              styles.itemRow,
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outlineVariant,
              },
              getCardShadow(theme),
            ]}
            onPress={() => openEditWordModal(item)}
          >
            <View style={styles.itemContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{item.category.icon}</Text>
              </View>

              <View style={styles.wordTexts}>
                <Text style={[styles.wordPrimary, { color: theme.colors.onSurface }]} numberOfLines={1}>
                  {item.word_en}
                </Text>
                <Text style={[styles.wordSecondary, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                  {item.word_ru}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    backgroundColor: "transparent",
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  itemRow: {
    borderRadius: 18,
    marginVertical: 8,
    paddingVertical: 8,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  wordTexts: {
    flex: 1,
  },
  wordPrimary: {
    fontSize: 16,
    fontWeight: "700",
  },
  wordSecondary: {
    fontSize: 14,
    fontWeight: "400",
  },
});
