import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import PickCategoryButton from "@/src/components/vocabulary/category/PickCategoryButton";
import WordsList from "@/src/components/vocabulary/word/WordsList";
import { Category } from "@/src/entity/types";
import { useVocabulary } from "@/src/hooks/useVocabulary";
import { SPACING_LG, SPACING_MD, SPACING_SM, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import { WordCriteria } from "@/src/service/criteria/impl/WordCriteria";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { IconButton } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WordsPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { text } = useLanguageContext();
  const { playTap } = useSoundPlayer();
  const { softImpact } = useHaptics();

  const { criteriaDto, updateWordCriteria } = useVocabulary();
  const [searchPattern, setSearchPattern] = useState(criteriaDto.searchPattern);

  const updateCriteria = (consumer: (criteria: WordCriteria) => void) => {
    const newCriteria = WordCriteria.fromRedux(criteriaDto);
    consumer(newCriteria);
    updateWordCriteria(newCriteria);
  };

  const clearSearch = () => {
    softImpact();
    Keyboard.dismiss();
    playTap();
    setSearchPattern("");
    updateCriteria((criteria) => criteria.appendCategory(undefined).appendSearchPattern(""));
  };

  const onSelectCategory = (category: Category) => {
    updateCriteria((criteria) => criteria.appendCategory(category));
  };

  const onTextSearch = (text: string) => {
    setSearchPattern(text);
    updateCriteria((criteria) => criteria.appendSearchPattern(text));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        entering={FadeInDown.springify()}
        style={[
          styles.navbar,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <IconButton
          icon="close"
          onPress={clearSearch}
          iconColor={theme.colors.error}
          containerColor={theme.colors.errorContainer}
          size={18}
          accessibilityLabel={text("vocabulary_clear_search_accessibility")}
        />
        <PickCategoryButton category={criteriaDto.category} onSelectCategory={onSelectCategory} truncateLength={7} />

        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Ionicons name="search" size={18} color={theme.colors.onSurfaceVariant} />
          <TextInput
            placeholder={text("vocabulary_search_placeholder")}
            value={searchPattern}
            onChangeText={onTextSearch}
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          // 60 is the height of the navbar
          paddingTop: SPACING_MD + 70,
          paddingBottom: insets.bottom + TAB_BAR_BASE_HEIGHT,
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
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING_SM,
    borderBottomWidth: 0,
    zIndex: 100,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
});
