import { Category } from "@/src/entity/types";
import { truncate } from "@/src/util/stringHelper";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { CategoryPicker } from "../category/CategoryPicker";

interface PickCategoryButtonProps {
  readonly category?: Category;
  readonly onSelectCategory: (category: Category) => void;
  readonly truncateLength?: number;
  readonly onClose?: () => void;
}

export default function PickCategoryButton({
  category,
  onSelectCategory,
  onClose,
  truncateLength,
}: PickCategoryButtonProps) {
  const theme = useTheme();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const getCategoryName = () => {
    if (!category) return "Category";
    if (!truncateLength) return category.name;
    return truncate(category.name, truncateLength);
  };

  const handleSelectCategory = (category: Category) => {
    setShowCategoryPicker(false);
    onSelectCategory(category);
  };

  const handleClose = () => {
    setShowCategoryPicker(false);
    onClose?.();
  };

  return (
    <>
      <Button
        mode="contained-tonal"
        style={[
          styles.categorySelector,
          {
            backgroundColor: theme.colors.secondary,
          },
        ]}
        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        contentStyle={styles.categorySelectorButtonContent}
      >
        <View style={styles.categorySelectorContent}>
          {category?.icon && (
            <Text style={styles.categoryEmoji}>{category.icon}</Text>
          )}
          <Text style={[styles.categoryLabel, { color: theme.colors.onSecondary }]}>{getCategoryName()}</Text>
        </View>
      </Button>
      <CategoryPicker
        visible={showCategoryPicker}
        onClose={handleClose}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  categorySelector: {
    marginVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  categorySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categorySelectorButtonContent: {
    justifyContent: "flex-start",
  },
});
