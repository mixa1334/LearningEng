import { useVocabulary } from "@/hooks/useVocabulary";
import { Word } from "@/model/entity/types";
import { MAX_LIST_HEIGHT } from "@/resources/constants/constants";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Portal, Text, useTheme } from "react-native-paper";
import EditWordDialog from "./EditWordDialog";

const ItemSeparator = () => <Divider />;

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
      <Portal>
        {showEditWordModal && wordToEdit && (
          <EditWordDialog
            visible={showEditWordModal}
            exit={() => setShowEditWordModal(false)}
            word={wordToEdit}
          />
        )}
      </Portal>

      <FlatList
        style={{
          height: MAX_LIST_HEIGHT,
        }}
        data={words}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => openEditWordModal(item)}
            >
              <Text
                style={[styles.wordText, { color: theme.colors.onBackground }]}
              >
                {item.word_en} ({item.word_ru}) — {item.category.icon}{" "}
                {item.category.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
