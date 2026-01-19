import { useAppTheme, useThemeContext } from "@/src/components/common/ThemeProvider";
import { SPACING_MD } from "@/src/resources/constants/layout";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, IconButton, Switch, Text } from "react-native-paper";

import { useUserData } from "@/src/hooks/useUserData";
import { createBackupFileAndShare, restoreFromBackupFileUri } from "@/src/service/backupService";
import { useAppDispatch } from "@/src/store";
import { loadDailyWordSetThunk } from "@/src/store/slice/learnSlice";
import { reloadPracticeThunk } from "@/src/store/slice/practiceSlice";
import { loadTranslationsThunk } from "@/src/store/slice/translationSlice";
import { loadUserDataThunk } from "@/src/store/slice/userDataSlice";
import { initalizeVocabularyThunk } from "@/src/store/slice/vocabularySlice";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { SupportedLocales, useLanguageContext } from "../common/LanguageProvider";
import LoadingScreenSpinner from "../common/LoadingScreenSpinner";
import { ValuePickerDialog } from "../common/ValuePickerDialog";
import ExpandedCard from "./ExpandedCard";

export default function SettingsCard() {
  const dispatch = useAppDispatch();
  const { name } = useUserData();
  const { isDark, toggleTheme, toggleHihikTheme, isHihik } = useThemeContext();
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const { text, changeLanguage, isReady, locale } = useLanguageContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const theme = useAppTheme();

  const languageOptions = [
    { value: SupportedLocales.ENGLISH, key: SupportedLocales.ENGLISH, label: text("language_english_label") },
    { value: SupportedLocales.RUSSIAN, key: SupportedLocales.RUSSIAN, label: text("language_russian_label") },
  ];

  const hihikUser = name.toLowerCase().includes("hihik");

  if (!isReady) {
    return <LoadingScreenSpinner />;
  }

  const handleBackup = async () => {
    try {
      setIsProcessing(true);
      await createBackupFileAndShare();
    } catch (e) {
      console.error(e);
      Alert.alert(text("settings_backup_failed_title"), text("settings_backup_failed_message"));
    } finally {
      setIsProcessing(false);
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

      setIsProcessing(true);
      const uri = result.assets[0].uri;
      await restoreFromBackupFileUri(uri);

      await dispatch(loadUserDataThunk())
        .unwrap()
        .then(() =>
          Promise.all([
            dispatch(loadDailyWordSetThunk()).unwrap(),
            dispatch(loadTranslationsThunk()).unwrap(),
            dispatch(initalizeVocabularyThunk()).unwrap(),
            dispatch(reloadPracticeThunk()).unwrap(),
          ])
        );

      Alert.alert(text("settings_restore_completed_title"), text("settings_restore_completed_message"));
    } catch (e) {
      console.error(e);
      Alert.alert(
        text("settings_restore_failed_title"),
        e instanceof Error ? e.message : text("settings_restore_failed_message")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeLanguage = (locale: SupportedLocales) => {
    setIsLanguagePickerVisible(false);
    changeLanguage(locale);
  };

  const handlePickLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLanguagePickerVisible(true)
  };

  return (
    <ExpandedCard title={text("settings_title")} icon="settings" autoScroll={true} touchableOpacity={1}>
      <View style={{ marginTop: SPACING_MD }}>
        <View style={styles.switcherSettingRow}>
          <Text>{text("settings_dark_theme")}</Text>
          <Switch value={isDark} onValueChange={toggleTheme} disabled={isProcessing} />
        </View>
        {hihikUser && (
          <View style={styles.switcherSettingRow}>
            <LottieView
              source={require("@/assets/animations/like.json")}
              autoPlay
              loop={true}
              resizeMode="contain"
              style={styles.likeAnimation}
            />
            <Switch value={isHihik} onValueChange={toggleHihikTheme} disabled={isProcessing} />
          </View>
        )}
        <View style={styles.switcherSettingRow}>
          <Text>{text("language_title", { language: locale })}</Text>
          <IconButton style={{ backgroundColor: theme.colors.primary }}
            iconColor={theme.colors.onPrimary} icon="chevron-down" onPress={handlePickLanguage} />
          <ValuePickerDialog
            entityTitle={text("language")}
            description={text("language_description")}
            visible={isLanguagePickerVisible}
            onClose={() => setIsLanguagePickerVisible(false)}
            options={languageOptions}
            onSelectOption={handleChangeLanguage}
          />
        </View>
        <View style={styles.backupRestoreRow}>
          <Button mode="contained" style={styles.settingBtn} onPress={handleBackup} disabled={isProcessing}>
            {text("settings_backup_button")}
          </Button>
          <Button mode="contained" style={styles.settingBtn} onPress={handleRestore} disabled={isProcessing}>
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
    marginVertical: 8,
    marginBottom: 16,
    width: "100%",
  },
  backupRestoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  settingBtn: {
    marginVertical: 8,
    width: "50%",
  },
  likeAnimation: {
    width: 50,
    height: 50,
  },
});
