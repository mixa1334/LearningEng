import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import LearningMainMode from "@/src/components/learn/learning/LearningMainMode";
import PracticeMainSection from "@/src/components/learn/practice/PracticeMainSection";
import { SPACING_XL } from "@/src/resources/constants/layout";
import React from "react";
import { View } from "react-native";

export default function LearnTab() {
  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle="Learning & Practice">
        <ContentDivider name="Learning" />

        <LearningMainMode />

        <View style={{ marginTop: SPACING_XL }}>
          <ContentDivider name="Practice more" />
        </View>

        <PracticeMainSection />
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
