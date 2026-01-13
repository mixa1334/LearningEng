import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import LearningMainMode from "@/src/components/learn/learning/LearningMainMode";
import PracticeMain from "@/src/components/learn/practice/PracticeMain";
import { SPACING_XXL } from "@/src/resources/constants/layout";
import React from "react";
import { View } from "react-native";

export default function LearnPage() {
  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle="Learn & Practice">
        <ContentDivider name="Learning" />

        <LearningMainMode />

        <View style={{ marginTop: SPACING_XXL * 3 }}>
          <ContentDivider name="Practicing" />
        </View>

        <PracticeMain />
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}