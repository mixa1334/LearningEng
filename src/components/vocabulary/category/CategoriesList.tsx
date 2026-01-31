import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { getCardShadow } from "../../common/cardShadow";
import { useHaptics } from "../../common/HapticsProvider";
import { useSoundPlayer } from "../../common/SoundProvider";
import { useAppTheme } from "../../common/ThemeProvider";
import EditCategoryDialog from "./EditCategoryDialog";
import { MaterialIcons } from "@expo/vector-icons";

export default function CategoriesList() {
  const theme = useAppTheme();
  const { userCategories } = useVocabulary();
  const { playTap } = useSoundPlayer();
  const { lightImpact } = useHaptics();
  
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const openEditCategoryModal = (category: Category) => {
    playTap();
    lightImpact();
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
        {userCategories.map((item, index) => (
          <Animated.View
            key={item.id.toString()}
            entering={FadeInDown.delay(index * 50).springify()}
            layout={Layout.springify()}
          >
            <Pressable
              style={({ pressed }) => [
                styles.itemRow,
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
                getCardShadow(theme),
              ]}
              onPress={() => openEditCategoryModal(item)}
            >
              <View style={styles.itemContent}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                </View>
                <View style={styles.itemMain}>
                  <Text style={[styles.wordText, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                <MaterialIcons name="edit" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  itemRow: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemMain: {
    flex: 1,
    marginRight: 12,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
  },
  iconText: {
      fontSize: 20,
  },
  wordText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
