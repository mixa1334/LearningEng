import { usePractice } from "@/src/hooks/usePractice";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-paper";
import { useAppTheme } from "../../common/ThemeProvider";
import PickCategoryButton from "../../vocabulary/category/PickCategoryButton";

export default function PracticeModeSettings() {
  const {
    onlyUserAddedWords,
    setOnlyUserWords,
    category,
    setCategory,
    resetSet,
  } = usePractice();
  const theme = useAppTheme();

  useEffect(() => {
    resetSet();
  }, [category, onlyUserAddedWords, resetSet]);

  const handleOnlyUserWords = () => {
    setOnlyUserWords(!onlyUserAddedWords);
  };

  return (
    <View
      style={[styles.topRow, { backgroundColor: theme.colors.surfaceVariant }]}
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
      <PickCategoryButton
        category={category}
        onSelectCategory={setCategory}
        onClose={() => setCategory(undefined)}
        truncateLength={7}
      />
    </View> 
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
