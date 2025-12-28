import { useVocabulary } from "@/src/hooks/useVocabulary";
import { Category } from "@/src/model/entity/types";
import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import EditCategoryDialog from "./EditCategoryDialog";

export default function CategoriesList() {
  const theme = useTheme();
  const { userCategories } = useVocabulary();

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
      <View style={[styles.listContent, { maxHeight: maxListHeight }]}>
        {userCategories.map((item) => (
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
            onPress={() => openEditCategoryModal(item)}
          >
            <View style={styles.itemContent}>
              <View style={styles.itemMain}>
                <Text
                  style={[styles.wordText, { color: theme.colors.onSurface }]}
                  numberOfLines={1}
                >
                  {item.icon} {item.name}
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
  itemMain: {
    flex: 1,
    marginRight: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
