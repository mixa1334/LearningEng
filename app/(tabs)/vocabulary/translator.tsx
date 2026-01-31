import { getCardShadow } from "@/src/components/common/cardShadow";
import { useHaptics } from "@/src/components/common/HapticsProvider";
import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { LoadingContentSpinner } from "@/src/components/common/LoadingContentSpinner";
import { useSoundPlayer } from "@/src/components/common/SoundProvider";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import TranslationCard from "@/src/components/vocabulary/translation/TranslationCard";
import TranslatorSettings from "@/src/components/vocabulary/translation/TranslatorSettings";
import { Language } from "@/src/entity/types";
import { useTranslationActions, useTranslationData } from "@/src/hooks/useTranslation";
import { SPACING_XL, SPACING_XS, SPACING_XXS, TAB_BAR_BASE_HEIGHT } from "@/src/resources/constants/layout";
import { StateType } from "@/src/store/slice/stateType";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslatorPage() {
  const theme = useAppTheme();
  const { text } = useLanguageContext();
  const { latestTranslationId, status, clearTranslatorInputField } = useTranslationData();
  const { translateWord } = useTranslationActions();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);
  const insets = useSafeAreaInsets();
  const { playTap } = useSoundPlayer();
  const { softImpact, lightImpact } = useHaptics();
  const router = useRouter();
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatorSettingsVisible, setIsTranslatorSettingsVisible] = useState(false);

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
    setWordToTranslate("");
    setLanguage((prev) => (prev === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH));
  };

  const handleTranslate = () => {
    if (isTranslating || wordToTranslate.trim() === "") return;
    setIsTranslating(true);
    playTap();
    lightImpact();
    Keyboard.dismiss();
    translateWord(wordToTranslate, language);
    if(clearTranslatorInputField) {
      setWordToTranslate("");
    }
  };

  const handleOpenHistory = () => {
    playTap();
    softImpact();
    router.push("./translations");
  };


  if (status === StateType.failed) {

    //todo global error handler
    
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
      <TranslatorSettings visible={isTranslatorSettingsVisible} onClose={() => setIsTranslatorSettingsVisible(false)} />
      
      <Animated.View entering={FadeInDown.springify()}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }, getCardShadow(theme)]}>
            <View style={styles.cardHeader}>
                <Pressable
                    onPress={switchLanguages}
                    style={({ pressed }) => [
                        styles.langSwitch,
                        {
                            backgroundColor: theme.colors.secondaryContainer,
                            opacity: pressed ? 0.8 : 1,
                            transform: [{ scale: pressed ? 0.97 : 1 }],
                        },
                    ]}
                >
                    <Text style={{ color: theme.colors.onSecondaryContainer, fontSize: 16, fontWeight: "600" }}>
                        {language === Language.ENGLISH ? text("translation_card_title_en_ru") : text("translation_card_title_ru_en")}
                    </Text>
                </Pressable>
                
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="cog"
                        onPress={() => setIsTranslatorSettingsVisible(true)}
                        iconColor={theme.colors.onSurfaceVariant}
                        size={24}
                    />
                    <IconButton
                        icon="history"
                        onPress={handleOpenHistory}
                        iconColor={theme.colors.onSurfaceVariant}
                        size={24}
                    />
                </View>
            </View>

            <Card.Content style={styles.content}>
            <TextInput
                mode="outlined"
                placeholder={language === Language.ENGLISH ? text("translation_placeholder_en") : text("translation_placeholder_ru")}
                value={wordToTranslate}
                onChangeText={setWordToTranslate}
                onSubmitEditing={handleTranslate}
                returnKeyType="search"
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                outlineStyle={{ borderRadius: 12 }}
            />
            </Card.Content>
            
            <Card.Actions style={styles.actions}>
            {isTranslating ? <View style={styles.loadingContainer}><LoadingContentSpinner /></View> : (
                <Button 
                    mode="contained" 
                    icon="translate" 
                    onPress={handleTranslate} 
                    buttonColor={theme.colors.primary} 
                    textColor={theme.colors.onPrimary}
                    style={{ borderRadius: 12, flex: 1 }}
                    contentStyle={{ height: 48 }}
                >
                {text("translation_translate_button")}
                </Button>
            )}
            </Card.Actions>
        </Card>
      </Animated.View>

      <View style={styles.currentTranslationContainer}>
        {latestTranslationId && (
            <Animated.View entering={FadeInDown.delay(200).springify()}>
                <TranslationCard translationId={latestTranslationId} />
            </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    marginBottom: 25,
    padding: 8,
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingTop: 8,
  },
  langSwitch: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
  },
  content: {
    marginVertical: 8,
  },
  input: {
    fontSize: 18,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  currentTranslationContainer: {
    paddingHorizontal: 8,
  },
  loadingContainer: {
    alignSelf: "center",
    width: "100%",
    height: 50,
  },
});
