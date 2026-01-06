import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { Language, Translation } from "@/src/entity/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { SPACING_XL, SPACING_XXL } from "@/src/resources/constants/layout";
import { StateType } from "@/src/store/slice/stateType";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
  useTheme
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslationPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentTranslation,
    translations,
    status,
    translateWord,
    clearTranslations,
  } = useTranslation();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = SPACING_XXL;
  const pageBottomPadding = insets.bottom + SPACING_XL;

  const switchLanguages = () => {
    setLanguage((prev) =>
      prev === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH
    );
  };

  const translate = () => {
    translateWord(wordToTranslate, language);
    setWordToTranslate("");
  };

  const openWordFromTranslationModal = (translation: Translation) => {
    router.push({
      pathname: "/WordFromTranslationModal",
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
          backgroundColor: theme.colors.background,
          paddingTop: pageTopPadding,
          paddingBottom: pageBottomPadding,
          paddingHorizontal: pageHorizontalPadding,
        },
      ]}
    >
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
      >
        <Card.Title
          title={
            language === Language.ENGLISH
              ? "English → Russian"
              : "Russian → English"
          }
          left={(props) => (
            <Ionicons
              {...props}
              name={"language-outline"}
              size={24}
              color={theme.colors.onSecondaryContainer}
            />
          )}
        />
        <Card.Content>
          <TextInput
            mode="outlined"
            placeholder={
              language === Language.ENGLISH
                ? "Enter English word"
                : "Enter Russian word"
            }
            value={wordToTranslate}
            onChangeText={setWordToTranslate}
            style={styles.input}
          />
          <Text style={styles.result}>
            {currentTranslation?.word_en} - {currentTranslation?.word_ru}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="swap-horizontal"
            onPress={switchLanguages}
            containerColor={theme.colors.onSecondaryContainer}
            iconColor={theme.colors.secondaryContainer}
            size={24}
            accessibilityLabel="Switch Languages"
          />
          <Button
            mode="contained"
            icon="translate"
            onPress={translate}
            buttonColor="#81c784"
            textColor="#1b5e20"
          >
            Translate
          </Button>
          <IconButton
            icon="delete"
            onPress={clearTranslations}
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
    elevation: 3,
    marginBottom: 12,
  },
  input: {
    marginTop: 12,
    marginBottom: 12,
  },
  result: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  actions: {
    justifyContent: "space-between",
    marginTop: 12,
  },
  historyCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  dialogTranslationText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionLabel: {
    marginVertical: 8,
    fontWeight: "600",
  },
  categorySelector: {
    marginBottom: 4,
    borderRadius: 8,
  },
  dialogActions: {
    justifyContent: "center",
    paddingBottom: 8,
  },
});
