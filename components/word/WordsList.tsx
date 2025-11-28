import { useVocabulary } from "@/hooks/useVocabulary";
import { MAX_LIST_HEIGHT } from "@/resources/constants/constants";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";

const ItemSeparator = () => <Divider />;

export default function WordsList() {
  const theme = useTheme();
  const { words } = useVocabulary();

  return (
    <FlatList
      style={{
        maxHeight: MAX_LIST_HEIGHT,
      }}
      data={words}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          {/* <TouchableOpacity
              style={styles.itemRow}
              onPress={() => {
                setWordToEdit(item); // store the word you want to edit
                setShowEditWordModal(true); // open the edit modal
              }}
            > */}
          <Text style={[styles.wordText, { color: theme.colors.onBackground }]}>
            {item.word_en} ({item.word_ru}) — {item.category.icon}{" "}
            {item.category.name}
          </Text>
          {/* </TouchableOpacity> */}
        </View>
      )}
    />
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
