import { Category } from "@/src/entity/types";
import { truncate } from "@/src/util/stringHelper";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { useLanguageContext } from "../../common/LanguageProvider";
import { CategoryPicker } from "../category/CategoryPicker";

interface PickCategoryButtonProps {
  readonly category?: Category;
  readonly onSelectCategory: (category: Category) => void;
  readonly truncateLength?: number;
  readonly onClose?: () => void;
}

export default function PickCategoryButton({ category, onSelectCategory, onClose, truncateLength }: PickCategoryButtonProps) {
  const theme = useTheme();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const { text } = useLanguageContext();

  const handleSelectCategory = (category: Category) => {
    onSelectCategory(category);
    setShowCategoryPicker(false);
  };

  const handleClose = () => {
    onClose?.();
    setShowCategoryPicker(false);
  };

  const categoryName = (function () {
    if (!category) return text("vocabulary_category_default_label");
    if (!truncateLength) return category.name;
    return truncate(category.name, truncateLength);
  })();

  return (
    <View>
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
          <Text style={styles.categoryEmoji}>{category?.icon}</Text>
          <Text style={[styles.categoryLabel, { color: theme.colors.onSecondary }]}>{categoryName}</Text>
        </View>
      </Button>
      <CategoryPicker visible={showCategoryPicker} onClose={handleClose} onSelectCategory={handleSelectCategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  categorySelector: {
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
