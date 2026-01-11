import { getCardShadow } from "@/src/components/common/cardShadow";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { useAppTheme } from "@/src/components/common/ThemeProvider";
import { Language, Translation } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { SPACING_MD, SPACING_XL, SPACING_XXL } from "@/src/resources/constants/layout";
import { StateType } from "@/src/store/slice/stateType";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";

export default function TranslationPage() {
  const theme = useAppTheme();
  const router = useRouter();
  const { currentTranslation, translations, status, translateWord, clearTranslations } = useTranslation();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = SPACING_XXL;

  const switchLanguages = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setLanguage((prev) => (prev === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH));
  };

  const translate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateWord(wordToTranslate, language);
    setWordToTranslate("");
  };

  const handleClearHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearTranslations();
  };

  const openWordFromTranslationModal = (translation: Translation) => {
    router.push({
      pathname: "./save-translation",
      params: {
        translation_id: translation.id.toString(),
        word_en: translation.word_en,
        word_ru: translation.word_ru,
      },
    });
  };

  if (status === StateType.loading) {
    return <LoadingSpinner />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: pageTopPadding,
          paddingBottom: SPACING_MD,
          paddingHorizontal: pageHorizontalPadding,
        },
      ]}
    >
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.primary },
          getCardShadow(theme),
        ]}
      >
        <Card.Title
          titleStyle={{ color: theme.colors.onPrimary }}
          title={language === Language.ENGLISH ? "English → Russian" : "Russian → English"}
          left={(props) => <Ionicons {...props} name={"language-outline"} size={24} color={theme.colors.onPrimary} />}
        />
        <Card.Content>
          <TextInput
            mode="flat"
            placeholder={language === Language.ENGLISH ? "Enter English word" : "Enter Russian word"}
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
          {currentTranslation && (
            <Text style={[styles.result, { color: theme.colors.onPrimary }]}>
              {currentTranslation.word_en} - {currentTranslation.word_ru}
            </Text>
          )}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="swap-horizontal"
            onPress={switchLanguages}
            containerColor={theme.colors.onPrimary}
            iconColor={theme.colors.primary}
            size={24}
            accessibilityLabel="Switch Languages"
          />
          <Button mode="contained" icon="translate" onPress={translate} buttonColor="#81c784" textColor="#1b5e20">
            Translate
          </Button>
          <IconButton
            icon="delete"
            onPress={handleClearHistory}
            containerColor={theme.colors.error}
            iconColor={theme.colors.onError}
            size={24}
            accessibilityLabel="Clear history"
          />
        </Card.Actions>
      </Card>

      <FlatList
        data={translations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={[
              styles.historyCard,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Card.Content
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>
                {item.word_en} - {item.word_ru}
              </Text>
              <IconButton
                icon="plus"
                onPress={() => openWordFromTranslationModal(item)}
                containerColor="#81c784"
                iconColor="#1b5e20"
                size={24}
                accessibilityLabel="Add to vocabulary"
              />
            </Card.Content>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ marginTop: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
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
    borderRadius: 8,
  },
});


