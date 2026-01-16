import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import LearningMainMode from "@/src/components/learn/learning/LearningMainMode";
import PracticeMain from "@/src/components/learn/practice/PracticeMain";
import { SPACING_XXL } from "@/src/resources/constants/layout";
import React from "react";
import { View } from "react-native";

export default function LearnPage() {
  const { text } = useLanguageContext();

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle={text("tabs_learn_title")}>
        <ContentDivider name={text("learn_tab_label")} />

        <LearningMainMode />

        <View style={{ marginTop: SPACING_XXL * 1.5 }}>
          <ContentDivider name={text("review_tab_label")} />
        </View>

        <PracticeMain />
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
