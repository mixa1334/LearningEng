import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getCardShadow } from "../../common/cardShadow";
import { useSoundPlayer } from "../../common/SoundProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import EditCategoryDialog from "./EditCategoryDialog";

export default function CategoriesList() {
  const theme = useAppTheme();
  const { userCategories } = useVocabulary();
  const { playTap } = useSoundPlayer();
  
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const openEditCategoryModal = (category: Category) => {
    playTap();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          <Pressable
            key={item.id.toString()}
            style={({ pressed }) => [
              styles.itemRow,
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outlineVariant,
              },
              getCardShadow(theme),
            ]}
            onPress={() => openEditCategoryModal(item)}
          >
            <View style={styles.itemContent}>
              <View style={styles.itemMain}>
                <Text style={[styles.wordText, { color: theme.colors.onSurface }]} numberOfLines={1}>
                  {item.icon} {item.name}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  itemRow: {
    borderRadius: 18,
    marginVertical: 8,
    paddingVertical: 8,
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
