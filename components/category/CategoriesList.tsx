import { useVocabulary } from "@/hooks/useVocabulary";
import { EntityType } from "@/model/entity/types";
import { MAX_LIST_HEIGHT } from "@/resources/constants/constants";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, IconButton, Text, useTheme } from "react-native-paper";

const ItemSeparator = () => <Divider />;

export default function CategoriesList() {
  const { categories, removeCategory } = useVocabulary();
  const theme = useTheme();
  return (
    <FlatList
      style={{
        maxHeight: MAX_LIST_HEIGHT,
      }}
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <Text style={[styles.wordText, { color: theme.colors.onBackground }]}>
            {item.icon} {item.name}
          </Text>
          {item.type === EntityType.useradd && (
            <IconButton size={17} icon="delete" onPress={() => removeCategory(item)} />
          )}
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
});
