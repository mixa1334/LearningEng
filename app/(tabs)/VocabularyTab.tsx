import AnimatedScrollView from "@/src/components/common/AnimatedScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import { TouchableCard } from "@/src/components/common/TouchableCard";
import { useRouter } from "expo-router";
import React from "react";

export default function VocabularyTab() {
  const router = useRouter();
  const navigateToCategory = () => router.push("/CategoryVocabularyPage");
  const navigateToWord = () => router.push("/WordVocabularyPage");
  const navigateToTranslation = () => router.push("/TranslationPage");

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle="Vocabulary">
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
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
