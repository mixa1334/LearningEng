import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import ContentDivider from "@/src/components/common/ContentDivider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import LearningMainMode from "@/src/components/learn/learning/LearningMainMode";
import PracticeMain from "@/src/components/learn/practice/PracticeMain";
import { SPACING_XXL } from "@/src/resources/constants/layout";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function LearnPage() {
  const { text } = useLanguageContext();

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle={text("tabs_learn_title")}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
            <ContentDivider name={text("learn_section_title")} />
            <LearningMainMode />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ marginTop: SPACING_XXL * 1.5 }}>
          <ContentDivider name={text("practice_section_title")} />
          <PracticeMain />
        </Animated.View>
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
