import { TouchableCard } from "@/components/common/TouchableCard";
import { SPACING_LG, SPACING_MD, TAB_BAR_BASE_HEIGHT } from "@/resources/constants/layout";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VocabularyTab() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = insets.top + SPACING_MD;
  const pageBottomPadding = insets.bottom + SPACING_MD + TAB_BAR_BASE_HEIGHT;

  const navigateToCategory = () => router.push("/CategoryVocabularyPage");
  const navigateToWord = () => router.push("/WordVocabularyPage");
  const navigateToTranslation = () => router.push("/TranslationPage");

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: pageTopPadding,
          paddingBottom: pageBottomPadding,
          paddingHorizontal: pageHorizontalPadding,
        },
      ]}
    >
      <TouchableCard
        icon="albums-outline"
        title="Categories"
        description="Manage your categories! Create, edit, remove!"
        onPress={navigateToCategory}
      />
      <TouchableCard
        icon="book-outline"
        title="Words"
        description="Manage your words! Create, edit, remove!"
        onPress={navigateToWord}
      />
      <TouchableCard
        icon="language-outline"
        title="Translation"
        description="Translate words freely between English and Russian!"
        onPress={navigateToTranslation}
      />
    </View>
  );
}