import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { TouchableCard } from "@/src/components/common/TouchableCard";
import { useRouter } from "expo-router";
import React from "react";

export default function VocabularyPage() {
  const router = useRouter();
  const { text } = useLanguageContext();

  const navigateToCategory = () => router.push("/(tabs)/vocabulary/categories");
  const navigateToWord = () => router.push("/(tabs)/vocabulary/words");
  const navigateToTranslation = () => router.push("/(tabs)/vocabulary/translation");

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle={text("vocabulary_header_title")}>
        <TouchableCard
          icon="albums-outline"
          title={text("vocabulary_index_categories_title")}
          description={text("vocabulary_index_categories_description")}
          onPress={navigateToCategory}
        />
        <TouchableCard
          icon="language-outline"
          title={text("vocabulary_index_translation_title")}
          description={text("vocabulary_index_translation_description")}
          onPress={navigateToTranslation}
        />
        <TouchableCard
          icon="book-outline"
          title={text("vocabulary_index_words_title")}
          description={text("vocabulary_index_words_description")}
          onPress={navigateToWord}
        />
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
