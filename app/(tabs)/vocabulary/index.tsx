import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import { TouchableCard } from "@/src/components/common/TouchableCard";
import { useRouter } from "expo-router";
import React from "react";

export default function VocabularyPage() {
  const router = useRouter();
  const navigateToCategory = () => router.push("/(tabs)/vocabulary/categories");
  const navigateToWord = () => router.push("/(tabs)/vocabulary/words");
  const navigateToTranslation = () => router.push("/(tabs)/vocabulary/translation");

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