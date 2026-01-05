import { Category } from "@/src/entity/types";
import { usePractice } from "@/src/hooks/usePractice";
import { truncate } from "@/src/util/stringHelper";
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

  const handleCloseCategoryPicker = () => {
    setShowCategoryPicker(false);
    setCategory(undefined);
    resetSet();
  };

  const handleSelectNewCategory = (category: Category) => {
    setShowCategoryPicker(false);
    setCategory(category);
    resetSet();
  };

  const handleOnlyUserWords = () => {
    setOnlyUserWords(!onlyUserAddedWords);
    resetSet();
  };

  return (
    <>
      <View
        style={[
          styles.topRow,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <View style={styles.switcherContainer}>
          <Text style={[styles.topRowLabel, { color: theme.colors.onSurface }]}>
            only user words
          </Text>
          <Switch
            value={onlyUserAddedWords}
            onValueChange={handleOnlyUserWords}
          />
        </View>
        <Button
          mode="contained-tonal"
          style={[
            {
              backgroundColor: theme.colors.outline,
            },
          ]}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text
            style={[
              styles.categorySelectorText,
              { color: theme.colors.background },
            ]}
          >
            {category
              ? category.icon + " " + truncate(category.name, 7)
              : "Category"}
          </Text>
        </Button>
      </View>
      <CategoryPicker
        visible={showCategoryPicker}
        onClose={handleCloseCategoryPicker}
        onSelectCategory={handleSelectNewCategory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  switcherContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  topRowLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  categorySelectorText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
