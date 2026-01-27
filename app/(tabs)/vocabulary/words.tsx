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
          accessibilityLabel={text("vocabulary_clear_search_accessibility")}
        />
        <PickCategoryButton category={criteriaDto.category} onSelectCategory={onSelectCategory} truncateLength={7} />

        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="search" size={18} color={theme.colors.onSurface} />
          <TextInput
            placeholder={text("vocabulary_search_placeholder")}
            value={searchPattern}
            onChangeText={onTextSearch}
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
    minHeight: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
  },
});


