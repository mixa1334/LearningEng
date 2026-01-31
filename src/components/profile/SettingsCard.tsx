import { useAppTheme, useThemeContext } from "@/src/components/common/ThemeProvider";
import { Language } from "@/src/entity/types";
import { SPACING_MD } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Alert, StyleSheet, View, Pressable } from "react-native";
import { Button, IconButton, Switch, Text } from "react-native-paper";

import { useAppDispatch } from "@/src/hooks/hooks";
import { useUserData } from "@/src/hooks/useUserData";
import { createBackupFileAndShare, restoreFromBackupFileUri } from "@/src/service/backupService";
import { loadDailyWordSetThunk } from "@/src/store/slice/learnSlice";
import { reloadPracticeThunk } from "@/src/store/slice/practiceSlice";
import { initTranslationThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { initalizeVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import * as DocumentPicker from "expo-document-picker";
import LottieView from "lottie-react-native";
import { useHaptics, useHapticsContext } from "../common/HapticsProvider";
import { useLanguageContext } from "../common/LanguageProvider";
import { useLoadingOverlay } from "../common/LoadingOverlayProvider";
import { useSoundContext, useSoundPlayer } from "../common/SoundProvider";
import { ValuePickerDialog } from "../common/ValuePickerDialog";
import ExpandedCard from "./ExpandedCard";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingsCard() {
  const dispatch = useAppDispatch();
  const { name } = useUserData();
  const { show, hide } = useLoadingOverlay();
  const { isDark, toggleTheme, toggleHihikTheme, isHihik } = useThemeContext();
  const { playActionSuccess, playRejected } = useSoundPlayer();
  const { hapticsEnabled, toggleHaptics } = useHapticsContext();
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const { text, changeLanguage, locale } = useLanguageContext();
  const { soundEnabled, toggleSound, isSoundReady } = useSoundContext();
  const theme = useAppTheme();
  const { lightImpact } = useHaptics();

  const languageOptions = [
    { value: Language.ENGLISH, key: Language.ENGLISH, label: text("language_english_label") },
    { value: Language.RUSSIAN, key: Language.RUSSIAN, label: text("language_russian_label") },
  ];

  const hihikUser = name.toLowerCase().includes("hihik");

  const handleBackup = async () => {
    try {
      show();
      await createBackupFileAndShare();
      playActionSuccess();
      Alert.alert(text("settings_backup_completed_title"), text("settings_backup_completed_message"));
    } catch (e) {
      console.error(e);
      playRejected();
      Alert.alert(text("settings_backup_failed_title"), text("settings_backup_failed_message"));
    } finally {
      hide();
    }
  };

  const handleRestore = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      show();
      const uri = result.assets[0].uri;
      
      await restoreFromBackupFileUri(uri);

      await dispatch(loadUserDataThunk());
      await dispatch(loadDailyWordSetThunk());
      await dispatch(initTranslationThunk());
      await dispatch(initalizeVocabularyThunk());
      await dispatch(reloadPracticeThunk());

      playActionSuccess();
      Alert.alert(text("settings_restore_completed_title"), text("settings_restore_completed_message"));
    } catch (e) {
      console.error(e);
      playRejected();
      Alert.alert(
        text("settings_restore_failed_title"),
        e instanceof Error ? e.message : text("settings_restore_failed_message")
      );
    } finally {
      hide();
    }
  };

  const handleChangeLanguage = (locale: Language) => {
    setIsLanguagePickerVisible(false);
    changeLanguage(locale);
  };

  const handlePickLanguage = () => {
    lightImpact();
    setIsLanguagePickerVisible(true)
  };

  const SettingRow = ({ label, value, onToggle, disabled, icon }: any) => (
      <View style={styles.switcherSettingRow}>
          <View style={styles.rowLeft}>
              <MaterialIcons name={icon} size={20} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.rowLabel}>{label}</Text>
          </View>
          <Switch value={value} onValueChange={onToggle} disabled={disabled} />
      </View>
  );

  return (
    <ExpandedCard title={text("settings_title")} icon="settings" autoScroll={true} touchableOpacity={1}>
      <View style={{ marginTop: SPACING_MD }}>
        <SettingRow 
            label={text("settings_dark_theme")} 
            value={isDark} 
            onToggle={toggleTheme} 
            icon="dark-mode"
        />
        <SettingRow 
            label={text("settings_sound_enabled")} 
            value={soundEnabled} 
            onToggle={toggleSound} 
            disabled={!isSoundReady}
            icon="volume-up"
        />
        <SettingRow 
            label={text("settings_haptics_enabled")} 
            value={hapticsEnabled} 
            onToggle={toggleHaptics} 
            icon="vibration"
        />
        
        {hihikUser && (
          <View style={styles.switcherSettingRow}>
            <View style={styles.rowLeft}>
                <LottieView
                source={require("@/assets/animations/like.json")}
                autoPlay
                loop={true}
                resizeMode="contain"
                style={styles.likeAnimation}
                />
                <Text style={styles.rowLabel}>Hihik Mode</Text>
            </View>
            <Switch value={isHihik} onValueChange={toggleHihikTheme} />
          </View>
        )}

        <Pressable onPress={handlePickLanguage} style={styles.languageRow}>
            <View style={styles.rowLeft}>
                <MaterialIcons name="language" size={20} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.rowLabel}>{text("language")}</Text>
            </View>
            <View style={styles.languageValue}>
                <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>{locale.toUpperCase()}</Text>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
            </View>
        </Pressable>
        <ValuePickerDialog
            entityTitle={text("language")}
            description={text("language_description")}
            visible={isLanguagePickerVisible}
            onClose={() => setIsLanguagePickerVisible(false)}
            options={languageOptions}
            onSelectOption={handleChangeLanguage}
        />

        <View style={styles.divider} />

        <View style={styles.backupRestoreRow}>
          <Button 
            mode="contained-tonal" 
            style={styles.settingBtn} 
            onPress={handleBackup}
            icon="cloud-upload"
          >
            {text("settings_backup_button")}
          </Button>
          <Button 
            mode="contained-tonal" 
            style={styles.settingBtn} 
            onPress={handleRestore}
            icon="cloud-download"
          >
            {text("settings_restore_button")}
          </Button>
        </View>
      </View>
    </ExpandedCard>
  );
}

const styles = StyleSheet.create({
  switcherSettingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
  },
  rowLabel: {
      fontSize: 16,
      fontWeight: "500",
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  languageValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
  },
  divider: {
      height: 1,
      backgroundColor: "rgba(0,0,0,0.1)",
      marginVertical: 16,
  },
  backupRestoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  settingBtn: {
    flex: 1,
    borderRadius: 12,
  },
  likeAnimation: {
    width: 30,
    height: 30,
  },
});
