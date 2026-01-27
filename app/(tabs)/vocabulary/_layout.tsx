import { useLanguageContext } from "@/src/components/common/LanguageProvider";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { IconButton, useTheme } from "react-native-paper";
import { ClearHistoryButton } from "./translations";

export default function VocabularyLayout() {
  const theme = useTheme();
  const { text } = useLanguageContext();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surfaceVariant },
        headerTintColor: theme.colors.onBackground,
        headerBackTitle: text("nav_back_title"),
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="translator"
        options={{
          title: text("nav_translator_title"),
        }}
      />
      <Stack.Screen
        name="translations"
        options={{
          title: text("nav_translations_title"),
          headerRight: () => <ClearHistoryButton />,
        }}
      />
      <Stack.Screen
        name="words"
        options={{
          title: text("nav_words_title"),
          headerRight: () => <CreateButton route="./create-word" />,
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: text("nav_categories_title"),
          headerRight: () => <CreateButton route="./create-category" />,
        }}
      />
      <Stack.Screen
        name="create-category"
        options={{
          presentation: "modal",
          title: text("nav_create_category_title"),
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="create-word"
        options={{
          presentation: "modal",
          title: text("nav_create_word_title"),
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="save-translation"
        options={{
          presentation: "modal",
          title: text("nav_save_translation_title"),
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}

function BackButton() {
  const theme = useTheme();
  const { text } = useLanguageContext();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <IconButton
      icon="arrow-left"
      onPress={handleBack}
      iconColor={theme.colors.onBackground}
      size={24}
      accessibilityLabel={text("nav_back_accessibility")}
    />
  );
}

interface CreateButtonProps {
  readonly route: string;
}

function CreateButton({ route }: CreateButtonProps) {
  const theme = useTheme();
  const { text } = useLanguageContext();
  const router = useRouter();

  const handleCreate = () => {
    router.push(route as any);
  };

  return (
    <IconButton
      icon="plus-circle-outline"
      onPress={handleCreate}
      iconColor={theme.colors.onBackground}
      size={24}
      accessibilityLabel={text("nav_create_accessibility")}
    />
  );
}
