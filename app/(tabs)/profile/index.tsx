import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import DailyGoalCard from "@/src/components/profile/DailyGoalCard";
import FaqCard from "@/src/components/profile/FaqCard";
import ProfileHeaderCard from "@/src/components/profile/ProfileHeaderCard";
import ProgressCard from "@/src/components/profile/ProgressCard";
import QuoteCard from "@/src/components/profile/QuoteCard";
import ResetProgressCard from "@/src/components/profile/ResetProgressCard";
import SettingsCard from "@/src/components/profile/SettingsCard";
import { useUserData } from "@/src/hooks/useUserData";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ProfilePage() {
  const { name } = useUserData();

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle={name}>
        <ProfileHeaderCard />

        <ProgressCard />

        <DailyGoalCard />

        <QuoteCard />

        <Animated.View entering={FadeInDown.delay(400).springify()}>
            <FaqCard />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).springify()}>
            <SettingsCard />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
            <ResetProgressCard />
        </Animated.View>
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
