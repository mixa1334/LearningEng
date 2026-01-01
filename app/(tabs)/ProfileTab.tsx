import { AutoScrollProvider, useAutoScroll } from "@/src/components/common/AutoScrollContext";
import DailyGoalCard from "@/src/components/profile/DailyGoalCard";
import FaqCard from "@/src/components/profile/FaqCard";
import ProfileHeaderCard from "@/src/components/profile/ProfileHeaderCard";
import ProgressCard from "@/src/components/profile/ProgressCard";
import QuoteCard from "@/src/components/profile/QuoteCard";
import SettingsCard from "@/src/components/profile/SettingsCard";
import { SPACING_XL, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileTab() {
  return (
    <AutoScrollProvider>
      <ProfileTabContent />
    </AutoScrollProvider>
  );
}

function ProfileTabContent() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { scrollViewRef } = useAutoScroll();

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = insets.top;
  const pageBottomPadding = insets.bottom + SPACING_XL + TAB_BAR_BASE_HEIGHT * 2;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1,backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: pageTopPadding,
        paddingBottom: pageBottomPadding,
        paddingHorizontal: pageHorizontalPadding,
      }}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeaderCard />

      <ProgressCard />

      <DailyGoalCard />

      <QuoteCard />

      <FaqCard />

      <SettingsCard/>
    </ScrollView>
  );
}
