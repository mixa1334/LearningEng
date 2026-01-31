import { Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { getCardShadow } from "../../common/cardShadow";
import { useHaptics } from "../../common/HapticsProvider";
import { useSoundPlayer } from "../../common/SoundProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import EditWordDialog from "./EditWordDialog";
import { MaterialIcons } from "@expo/vector-icons";

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
        {words.map((item, index) => (
          <Animated.View
            key={item.id.toString()}
            entering={FadeInDown.delay(index * 30).springify()}
            layout={Layout.springify()}
          >
            <Pressable
              style={({ pressed }) => [
                styles.itemRow,
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
                getCardShadow(theme),
              ]}
              onPress={() => openEditWordModal(item)}
            >
              <View style={styles.itemContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
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

                <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    backgroundColor: "transparent",
    paddingBottom: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  itemRow: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 22,
  },
  wordTexts: {
    flex: 1,
    gap: 2,
  },
  wordPrimary: {
    fontSize: 17,
    fontWeight: "700",
  },
  wordSecondary: {
    fontSize: 14,
    fontWeight: "400",
  },
});
