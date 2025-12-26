import { CategoryPicker } from "@/components/category/CategoryPicker";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useTranslation } from "@/hooks/useTranslation";
import { useVocabulary } from "@/hooks/useVocabulary";
import { Category, Language, Translation } from "@/model/entity/types";
import { SPACING_XL, SPACING_XXL } from "@/resources/constants/layout";
import { StateType } from "@/store/slice/stateType";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TranslationPage() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentTranslation,
    translations,
    status,
    removeTranslation,
    translateWord,
    clearTranslations,
  } = useTranslation();
  const { addWord } = useVocabulary();
  const [wordToTranslate, setWordToTranslate] = useState("");
  const [language, setLanguage] = useState(Language.ENGLISH);
  const [selectedTranslation, setSelectedTranslation] =
    useState<Translation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showAddToVocabDialog, setShowAddToVocabDialog] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const pageHorizontalPadding = SPACING_XL;
  const pageTopPadding = insets.top + SPACING_XXL;
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

  const openAddToVocabularyDialog = (translation: Translation) => {
    setSelectedTranslation(translation);
    setSelectedCategory(null);
    setShowAddToVocabDialog(true);
  };

  const closeAddToVocabularyDialog = () => {
    setShowAddToVocabDialog(false);
    setShowCategoryPicker(false);
    setSelectedTranslation(null);
    setSelectedCategory(null);
  };

  const handleSaveToVocabulary = () => {
    if (!selectedTranslation || !selectedCategory) return;

    addWord({
      word_en: selectedTranslation.word_en,
      word_ru: selectedTranslation.word_ru,
      transcription: "",
      category_id: selectedCategory.id,
      text_example: "",
    });

    removeTranslation(selectedTranslation);
    closeAddToVocabularyDialog();
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
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

      <Portal>
        <Dialog
          visible={showAddToVocabDialog}
          onDismiss={closeAddToVocabularyDialog}
          style={{ backgroundColor: theme.colors.secondaryContainer }}
        >
          <View style={styles.dialogHeader}>
            <Dialog.Title style={{ color: theme.colors.onBackground }}>
              Add to vocabulary
            </Dialog.Title>
            <IconButton
              icon="close"
              size={24}
              onPress={closeAddToVocabularyDialog}
              accessibilityLabel="Cancel adding to vocabulary"
            />
          </View>

          <Dialog.Content>
            {selectedTranslation && (
              <Text
                style={[
                  styles.dialogTranslationText,
                  { color: theme.colors.onBackground },
                ]}
              >
                {selectedTranslation.word_en} - {selectedTranslation.word_ru}
              </Text>
            )}

            <Text
              style={[
                styles.sectionLabel,
                { color: theme.colors.onBackground },
              ]}
            >
              Category
            </Text>
            <Button
              mode="outlined"
              style={styles.categorySelector}
              onPress={() => setShowCategoryPicker(true)}
            >
              {selectedCategory
                ? `${selectedCategory.icon} ${selectedCategory.name}`
                : "Select category"}
            </Button>

            <CategoryPicker
              visible={showCategoryPicker}
              onClose={() => setShowCategoryPicker(false)}
              onSelectCategory={handleSelectCategory}
            />
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="contained"
              icon="content-save"
              onPress={handleSaveToVocabulary}
              disabled={!selectedCategory || !selectedTranslation}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
                onPress={() => openAddToVocabularyDialog(item)}
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
