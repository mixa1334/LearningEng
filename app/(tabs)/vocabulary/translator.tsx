import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { useLoadingOverlay } from "@/src/components/common/LoadingOverlayProvider";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import TranslationCard from "@/src/components/vocabulary/translation/TranslationCard";
import { Language } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { SPACING_LG, SPACING_XS, SPACING_XXL, SPACING_XXS, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import { StateType } from "@/src/store/slice/stateType";
import { userAlerts } from "@/src/util/UserAlerts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, ScrollView, StyleSheet } from "react-native";
import { Button, Card, IconButton, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslatorPage() {
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { visible, show, hide } = useLoadingOverlay();
  const { currentTranslation, status, error, translateWord, resetError } = useTranslation();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);
  const insets = useSafeAreaInsets();
  const { playTap } = useSoundPlayer();
  const { softImpact, lightImpact, mediumImpact } = useHaptics();
  const router = useRouter();

  const pageHorizontalPadding = SPACING_LG;
  const pageTopPadding = SPACING_XXL;
  const pageBottomPadding = (Platform.OS === "android" ? insets.bottom : SPACING_XXS) + TAB_BAR_BASE_HEIGHT + SPACING_XS;

  useEffect(() => {
    if (status !== StateType.loading && visible) {
      hide();
    }
  }, [status, visible, hide]);

  const switchLanguages = () => {
    playTap();
    softImpact();
    setLanguage((prev) => (prev === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH));
  };

  const translate = () => {
    playTap();
    lightImpact();
    Keyboard.dismiss();
    show();
    translateWord(wordToTranslate, language);
    setWordToTranslate("");
  };

  const handleOpenHistory = () => {
    playTap();
    softImpact();
    router.push("./translations");
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
      <Card style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        <Card.Title
          titleStyle={{ color: theme.colors.onPrimary }}
          title={language === Language.ENGLISH ? text("translation_card_title_en_ru") : text("translation_card_title_ru_en")}
          left={(props) => <Ionicons {...props} name={"language-outline"} size={24} color={theme.colors.onPrimary} />}
        />
        <Card.Content>
          <TextInput
            mode="flat"
            placeholder={language === Language.ENGLISH ? text("translation_placeholder_en") : text("translation_placeholder_ru")}
            value={wordToTranslate}
            onChangeText={setWordToTranslate}
            style={[styles.input, { backgroundColor: theme.colors.secondaryContainer, borderRadius: 8 }]}
            theme={{
              colors: {
                primary: theme.colors.secondary,
                placeholder: theme.colors.onSecondaryContainer,
                text: theme.colors.onSecondaryContainer,
                background: theme.colors.secondaryContainer,
                surface: theme.colors.secondaryContainer,
                surfaceVariant: theme.colors.secondaryContainer,
                outline: "transparent",
                outlineVariant: "transparent",
              },
            }}
          />
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="swap-horizontal"
            onPress={switchLanguages}
            containerColor={theme.colors.onPrimary}
            iconColor={theme.colors.primary}
            size={24}
            accessibilityLabel={text("translation_switch_accessibility")}
          />
          <Button mode="contained" icon="translate" onPress={translate} buttonColor="#81c784" textColor="#1b5e20">
            {text("translation_translate_button")}
          </Button>
          <IconButton
            icon="history"
            onPress={handleOpenHistory}
            containerColor={theme.colors.secondary}
            iconColor={theme.colors.onSecondary}
            size={24}
            accessibilityLabel={text("translation_open_history_accessibility")}
          />
        </Card.Actions>
      </Card>
      {currentTranslation && <TranslationCard translation={currentTranslation} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 30,
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
});
