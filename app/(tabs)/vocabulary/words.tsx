import { useAppTheme } from "@/src/components/common/ThemeProvider";
import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import WordsList from "@/src/components/vocabulary/word/WordsList";
import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { SPACING_LG, SPACING_MD, SPACING_SM } from "@/src/resources/constants/layout";
import { WordCriteria } from "@/src/service/wordService";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WordsPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const { criteriaDto, updateWordCriteria } = useVocabulary();

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const [searchPattern, setSearchPattern] = useState("");

  useEffect(() => {
    const newCriteria = WordCriteria.fromRedux(criteriaDto);
    newCriteria.appendCategory(selectedCategory);
    newCriteria.appendSearchPattern(searchPattern);
    updateWordCriteria(newCriteria);
  }, [selectedCategory, searchPattern]);

  const clearSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setSearchPattern("");
    setSelectedCategory(undefined);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.navbar,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.onSurfaceVariant,
          },
        ]}
      >
        <IconButton
          icon="close"
          onPress={clearSearch}
          iconColor={theme.colors.onError}
          containerColor={theme.colors.error}
          size={18}
          accessibilityLabel="Clear search"
        />
        <PickCategoryButton category={selectedCategory} onSelectCategory={setSelectedCategory} truncateLength={7} />

        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={18} color={theme.colors.onSurface} />
          <TextInput
            placeholder="Search text..."
            value={searchPattern}
            onChangeText={setSearchPattern}
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholderTextColor={theme.colors.onSurface}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          // 60 is the height of the navbar
          paddingTop: SPACING_MD + 60,
          paddingBottom: insets.bottom,
          paddingHorizontal: SPACING_LG,
        }}
      >
        <WordsList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING_SM,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    zIndex: 100,
    gap: SPACING_MD,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
  },
});


