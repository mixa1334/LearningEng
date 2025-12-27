import { useVocabulary } from "@/src/hooks/useVocabulary";
import { Word } from "@/src/model/entity/types";
import React, { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import EditWordDialog from "./EditWordDialog";

export default function WordsList() {
  const theme = useTheme();
  const { userWords } = useVocabulary();
  const [showEditWordModal, setShowEditWordModal] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null);
  const { height: screenHeight } = useWindowDimensions();
  const maxListHeight = screenHeight * 0.35;

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
        {userWords.map((item) => (
          <TouchableOpacity
            key={item.id.toString()}
            style={[
              styles.itemRow,
              {
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => openEditWordModal(item)}
          >
            <Text
              style={[styles.wordText, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {item.category.icon} {item.word_en} - {item.word_ru}
            </Text>
          </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
