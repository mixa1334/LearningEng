import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import LearningMainMode from "@/src/components/learn/learning/LearningMainMode";
import PracticeMain from "@/src/components/learn/practice/PracticeMain";
import { SPACING_XL, SPACING_XXL } from "@/src/resources/constants/layout";
import React from "react";
import { View } from "react-native";

export default function LearnTab() {
  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle="Learning & Practice">
        <ContentDivider name="Learning" />

        <LearningMainMode />

        <View style={{ marginTop: SPACING_XXL * 2 }}>
          <ContentDivider name="Practice more" />
        </View>

        <View style={{ marginBottom: SPACING_XL}}>
          <PracticeMain />
        </View>
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
