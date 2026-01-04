import { Category } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Switch } from "react-native-paper";
import { useAppTheme } from "../common/ThemeProvider";
import { CategoryPicker } from "../vocabulary/category/CategoryPicker";

export default function PracticeModeSettings() {
  const {
    onlyUserAddedWords,
    setOnlyUserWords,
    category,
    setCategory,
    resetSet,
  } = usePractice();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const theme = useAppTheme();

  const handleCloseCategoryPicker = () => setShowCategoryPicker(false);

  const handleSelectNewCategory = (category: Category) => {
    handleCloseCategoryPicker();
    setCategory(category);
    resetSet();
  };

  const handleOnlyUserWords = () => setOnlyUserWords(!onlyUserAddedWords);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topRow,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={[styles.topRowLabel, { color: theme.colors.onSurface }]}>
          Only user added words
        </Text>
        <Switch
          value={onlyUserAddedWords}
          onValueChange={handleOnlyUserWords}
        />
      </View>
      <View
        style={[
          styles.topRow,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Button
          mode="contained-tonal"
          style={[
            styles.categorySelector,
            {
              backgroundColor: theme.colors.outlineVariant,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
          onPress={() => setShowCategoryPicker(true)}
          textColor={theme.colors.onSecondaryContainer}
          contentStyle={styles.categorySelectorButtonContent}
        >
          {category ? (
            <View style={styles.categorySelectorContent}>
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text style={styles.categoryLabel}>{category.name}</Text>
            </View>
          ) : (
            "Select category"
          )}
        </Button>
        <CategoryPicker
          visible={showCategoryPicker}
          onClose={handleCloseCategoryPicker}
          onSelectCategory={handleSelectNewCategory}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categorySelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categorySelectorButtonContent: {
    justifyContent: "flex-start",
  },
  categorySelector: {
    marginBottom: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  topRowLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
