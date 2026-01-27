import { getCardShadow } from "@/src/components/common/cardShadow";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { LoadingContentSpinner } from "@/src/components/common/LoadingContentSpinner";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import TranslationCard from "@/src/components/vocabulary/translation/TranslationCard";
import { Language } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { SPACING_XL, SPACING_XS, SPACING_XXS, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import { StateType } from "@/src/store/slice/stateType";
import { userAlerts } from "@/src/util/userAlerts";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslatorPage() {
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { currentTranslation, status, error, translateWord, resetError } = useTranslation();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);
  const insets = useSafeAreaInsets();
  const { playTap } = useSoundPlayer();
  const { softImpact, lightImpact } = useHaptics();
  const router = useRouter();
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (status === StateType.succeeded) {
      setTimeout(() => {
        setIsTranslating(false);
      }, 300);
    }
  }, [status]);

  const pageHorizontalPadding = SPACING_XS;
  const pageTopPadding = SPACING_XL;
  const pageBottomPadding = (Platform.OS === "android" ? insets.bottom : SPACING_XXS) + TAB_BAR_BASE_HEIGHT + SPACING_XS;

  const switchLanguages = () => {
    playTap();
    softImpact();
    setLanguage((prev) => (prev === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH));
  };

  const handleTranslate = () => {
    if (isTranslating || wordToTranslate.trim() === "") return;
    setIsTranslating(true);
    playTap();
    lightImpact();
    Keyboard.dismiss();
    translateWord(wordToTranslate, language);
  };

  const handleOpenHistory = () => {
    playTap();
    softImpact();
    router.push("./translations");
  };

  const handleOpenSettings = () => {
    //todo: open settings
  };

  if (status === StateType.failed) {

    userAlerts.sendUserError(error || text("translation_error_unknown"), () => resetError());
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: pageTopPadding,
        paddingBottom: pageBottomPadding,
        paddingHorizontal: pageHorizontalPadding,
      }}
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }, getCardShadow(theme)]}>
        <Card.Title
          titleStyle={{ color: theme.colors.onSurfaceVariant, alignSelf: "center" }}
          title={<Pressable
            onPress={switchLanguages}
            style={({ pressed }) => [
              {
                backgroundColor: theme.colors.primary,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: 8,
                paddingHorizontal: 6,
                paddingVertical: 8,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text style={{ color: theme.colors.onPrimary, fontSize: 16, fontWeight: "500" }}>{language === Language.ENGLISH ? text("translation_card_title_en_ru") : text("translation_card_title_ru_en")}</Text>
          </Pressable>}
        />
        <Card.Content style={styles.content}>
          <TextInput
            mode="flat"
            placeholder={language === Language.ENGLISH ? text("translation_placeholder_en") : text("translation_placeholder_ru")}
            value={wordToTranslate}
            onChangeText={setWordToTranslate}
            onSubmitEditing={handleTranslate}
            returnKeyType="search"
            style={[styles.input, { borderRadius: 8 }]}
          />
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="cog"
            onPress={handleOpenSettings}
            containerColor={theme.colors.primary}
            iconColor={theme.colors.onPrimary}
            size={24}
            accessibilityLabel={text("translation_open_settings_accessibility")}
          />
          {isTranslating ? <View style={styles.loadingContainer}><LoadingContentSpinner /></View> : (
            <Button mode="contained" icon="translate" onPress={handleTranslate} buttonColor={theme.colors.accept} textColor={theme.colors.onAcceptReject}>
              {text("translation_translate_button")}
            </Button>
          )}
          <IconButton
            icon="history"
            onPress={handleOpenHistory}
            containerColor={theme.colors.primary}
            iconColor={theme.colors.onPrimary}
            size={24}
            accessibilityLabel={text("translation_open_history_accessibility")}
          />
        </Card.Actions>
      </Card>
      <View style={styles.currentTranslationContainer}>
        {currentTranslation && <TranslationCard translation={currentTranslation} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 25,
    padding: 16,
  },
  content: {
    marginVertical: 15,
  },
  input: {
    marginTop: 12,
    marginBottom: 12,
  },
  result: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  actions: {
    justifyContent: "space-between",
    marginTop: 12,
  },
  historyCard: {
    borderRadius: 20,
  },
  currentTranslationContainer: {
    paddingHorizontal: SPACING_XL,
  },
  loadingContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
