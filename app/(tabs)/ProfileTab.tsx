import DailyGoalCard from "@/src/components/profile/DailyGoalCard";
import FaqCard from "@/src/components/profile/FaqCard";
import ProfileHeaderCard from "@/src/components/profile/ProfileHeaderCard";
import ProgressCard from "@/src/components/profile/ProgressCard";
import SettingsDialog from "@/src/components/profile/SettingsDialog";
import { SPACING_XL, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileTab() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = insets.top;
  const pageBottomPadding = insets.bottom + SPACING_XL + TAB_BAR_BASE_HEIGHT * 2;

  const toggleSettings = () => setSettingsVisible((prev) => !prev);

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.colors.background }]}
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

      <FaqCard />

      <Button mode="contained-tonal" icon="cog" onPress={toggleSettings} style={styles.settingsBtn}>
        Settings
      </Button>

      <SettingsDialog visible={settingsVisible} onDismiss={toggleSettings} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  settingsBtn: {
    marginTop: 12,
  },
});
