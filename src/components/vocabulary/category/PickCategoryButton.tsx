import { Category } from "@/src/entity/types";
import { stringHelper } from "@/src/util/stringHelper";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";
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
    return stringHelper.truncate(category.name, truncateLength);
  })();

  return (
    <View>
      <Button
        mode="contained-tonal"
        style={[
          styles.categorySelector,
          {
            backgroundColor: theme.colors.secondaryContainer,
          },
        ]}
        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
      >
        <View style={styles.categorySelectorContent}>
          {category ? (
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
          ) : (
              <MaterialIcons name="category" size={18} color={theme.colors.onSecondaryContainer} />
          )}
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.onSecondaryContainer} />
        </View>
      </Button>
      <CategoryPicker visible={showCategoryPicker} onClose={handleClose} onSelectCategory={handleSelectCategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  categorySelector: {
    borderRadius: 12,
  },
  categorySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
