import { useVocabulary } from "@/hooks/useVocabulary";
import { Category } from "@/model/entity/types";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { IconButton, Portal, Text, useTheme } from "react-native-paper";
import EditCategoryDialog from "./EditCategoryDialog";

export default function CategoriesList() {
  const theme = useTheme();
  const { userCategories, removeCategory } = useVocabulary();

  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const { height: screenHeight } = useWindowDimensions();
  const maxListHeight = screenHeight * 0.35;

  const openEditCategoryModal = (category: Category) => {
    setCategoryToEdit(category);
    setShowEditCategoryModal(true);
  };

  return (
    <>
      {showEditCategoryModal && categoryToEdit && (
        <EditCategoryDialog
          visible={showEditCategoryModal}
          exit={() => setShowEditCategoryModal(false)}
          category={categoryToEdit}
        />
      )}
      <View style={styles.listContent}>
        {userCategories.map((item) => (
          <TouchableOpacity
            key={item.id.toString()}
            style={[
              styles.itemRow,
              {
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => openEditCategoryModal(item)}
          >
            <Text style={[styles.wordText, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.icon} {item.name}
            </Text>
            <IconButton size={17} icon="delete" onPress={() => removeCategory(item)} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  itemMain: {
    flex: 1,
    marginRight: 4,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
