import AnimatedScrollView from "@/src/components/common/AnimatedScrollView";
import { AutoScrollProvider } from "@/src/components/common/AutoScrollContext";
import DailyGoalCard from "@/src/components/profile/DailyGoalCard";
import FaqCard from "@/src/components/profile/FaqCard";
import ProfileHeaderCard from "@/src/components/profile/ProfileHeaderCard";
import ProgressCard from "@/src/components/profile/ProgressCard";
import QuoteCard from "@/src/components/profile/QuoteCard";
import SettingsCard from "@/src/components/profile/SettingsCard";
import React from "react";

export default function ProfileTab() {
  return (
    <AutoScrollProvider>
      <AnimatedScrollView title="Profile" refreshingEnabled={false}>
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
