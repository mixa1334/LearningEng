import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, EntityType } from "@/model/entity/types";
import { MAX_LIST_HEIGHT } from "@/resources/constants/constants";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Divider,
  IconButton,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import EditCategoryDialog from "./EditCategoryDialog";

const ItemSeparator = () => <Divider />;

export default function CategoriesList() {
  const theme = useTheme();
  const { categories, removeCategory } = useVocabulary();

  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const openEditCategoryModal = (category: Category) => {
    setCategoryToEdit(category);
    setShowEditCategoryModal(true);
  };

  return (
    <>
      <Portal>
        {showEditCategoryModal && categoryToEdit && (
          <EditCategoryDialog
            visible={showEditCategoryModal}
            exit={() => setShowEditCategoryModal(false)}
            category={categoryToEdit}
          />
        )}
      </Portal>
      <FlatList
        style={{
          height: MAX_LIST_HEIGHT,
        }}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => openEditCategoryModal(item)}
            >
              <Text
                style={[styles.wordText, { color: theme.colors.onBackground }]}
              >
                {item.icon} {item.name}
              </Text>
            </TouchableOpacity>
            {item.type === EntityType.useradd && (
              <IconButton
                size={17}
                icon="delete"
                onPress={() => removeCategory(item)}
              />
            )}
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
});
