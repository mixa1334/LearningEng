import SettingsDialog from "@/src/components/profile/SettingsDialog";
import React, { useState } from "react";
import { Button } from "react-native-paper";

export default function SettingsCard() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const toggleSettings = () => setSettingsVisible((prev) => !prev);

  return (
    <>
      <Button
        mode="contained-tonal"
        icon="cog"
        onPress={toggleSettings}
        style={{ marginTop: 12 }}
      >
        Settings
      </Button>

      <SettingsDialog visible={settingsVisible} onDismiss={toggleSettings} />
    </>
  );
}
