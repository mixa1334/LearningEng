import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/model/entity/types";
import { SPACING_XL, SPACING_XXL } from "@/resources/constants/layout";
import { StateType } from "@/store/slice/stateType";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslationPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { currentTranslation, translations, status, removeTranslation, translateWord, clearTranslations } =
    useTranslation();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = insets.top + SPACING_XXL;
  const pageBottomPadding = insets.bottom + SPACING_XL;

  const switchLanguages = () => {
    setLanguage((prev) => (prev === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH));
  };

  const translate = () => {
    translateWord(wordToTranslate, language);
    setWordToTranslate("");
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
      <Card style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}>
        <Card.Title
          title={language === Language.ENGLISH ? "English → Russian" : "Russian → English"}
          left={(props) => <Ionicons {...props} name={"language-outline"} size={24} color={theme.colors.onSecondaryContainer} />}
        />
        <Card.Content>
          <TextInput
            mode="outlined"
            placeholder={language === Language.ENGLISH ? "Enter English word" : "Enter Russian word"}
            value={wordToTranslate}
            onChangeText={setWordToTranslate}
            style={styles.input}
          />
          <Text style={styles.result}>
            {currentTranslation?.word_en} - {currentTranslation?.word_ru}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained-tonal"
            icon="swap-horizontal"
            onPress={switchLanguages}
            buttonColor={theme.colors.onSecondaryContainer}
            textColor={theme.colors.secondaryContainer}
          >sw
          </Button>
          <Button mode="contained" icon="translate" onPress={translate} buttonColor="#81c784" textColor="#1b5e20">
            Translate
          </Button>
          <Button
            mode="contained"
            icon="delete"
            onPress={clearTranslations}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
          >
            CLS
          </Button>
        </Card.Actions>
      </Card>

      <FlatList
        data={translations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={[styles.historyCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text>
                {item.word_en} - {item.word_ru}
              </Text>
              <Button icon="delete" onPress={() => removeTranslation(item)} textColor={theme.colors.error}>
                Remove
              </Button>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={{ marginTop: 24}}
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
});
