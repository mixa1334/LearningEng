import AnimatedScrollView from "@/src/components/common/AnimatedAutoScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import DailyGoalCard from "@/src/components/profile/DailyGoalCard";
import FaqCard from "@/src/components/profile/FaqCard";
import ProfileHeaderCard from "@/src/components/profile/ProfileHeaderCard";
import ProgressCard from "@/src/components/profile/ProgressCard";
import QuoteCard from "@/src/components/profile/QuoteCard";
import SettingsCard from "@/src/components/profile/SettingsCard";
import { useUserData } from "@/src/hooks/useUserData";
import React from "react";

export default function ProfileTab() {
  const { name } = useUserData();

  return (
    <AutoScrollProvider>
      <AnimatedScrollView headerTitle={name}>
        <ProfileHeaderCard />

        <ProgressCard />

        <DailyGoalCard />

        <QuoteCard />

        <FaqCard />

        <SettingsCard />
      </AnimatedScrollView>
    </AutoScrollProvider>
  );
}
