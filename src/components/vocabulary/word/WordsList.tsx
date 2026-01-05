import { Word } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import EditWordDialog from "./EditWordDialog";

export default function WordsList() {
  const theme = useTheme();
  const { words } = useVocabulary();
  const [showEditWordModal, setShowEditWordModal] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null);

  const openEditWordModal = (word: Word) => {
    setWordToEdit(word);
    setShowEditWordModal(true);
  };

  return (
    <>
      {showEditWordModal && wordToEdit && (
        <EditWordDialog
          visible={showEditWordModal}
          exit={() => setShowEditWordModal(false)}
          word={wordToEdit}
        />
      )}

      <View style={styles.listContent}>
        {words.map((item) => (
          <TouchableRipple
            key={item.id.toString()}
            style={[
              styles.itemRow,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            borderless={false}
            rippleColor={theme.colors.outlineVariant}
            onPress={() => openEditWordModal(item)}
          >
            <View style={styles.itemContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{item.category.icon}</Text>
              </View>

              <View style={styles.wordTexts}>
                <Text
                  style={[
                    styles.wordPrimary,
                    { color: theme.colors.onSurface },
                  ]}
                  numberOfLines={1}
                >
                  {item.word_en}
                </Text>
                <Text
                  style={[
                    styles.wordSecondary,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                  numberOfLines={1}
                >
                  {item.word_ru}
                </Text>
              </View>
            </View>
          </TouchableRipple>
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
    marginVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    // subtle shadow for card-like look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
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
