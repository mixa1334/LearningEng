import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, EntityType } from "@/model/entity/types";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { IconButton, Portal, Text, useTheme } from "react-native-paper";
import EditCategoryDialog from "./EditCategoryDialog";

export default function CategoriesList() {
  const theme = useTheme();
  const { categories, removeCategory } = useVocabulary();

  const [showEditCategoryModal, setShowEditCategoryModal] =
    useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(
    null
  );
  const { height: screenHeight } = useWindowDimensions();
  const maxListHeight = screenHeight * 0.35;

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

      <ScrollView
        style={{ maxHeight: maxListHeight, backgroundColor: "transparent" }}
        nestedScrollEnabled
        contentContainerStyle={styles.listContent}
      >
        {categories.map((item, index) => (
          <View
            key={item.id.toString()}
            style={[
              styles.itemRow,
              {
                backgroundColor:
                  (theme.colors as any).surfaceVariant ?? theme.colors.surface,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.itemMain}
              onPress={() => openEditCategoryModal(item)}
            >
              <Text
                style={[styles.wordText, { color: theme.colors.onSurface }]}
                numberOfLines={1}
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
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
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
