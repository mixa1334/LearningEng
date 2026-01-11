import { Stack, useRouter } from "expo-router";
import React from "react";
import { IconButton, MD3Theme, useTheme } from "react-native-paper";

export default function VocabularyLayout() {
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="translation"
        options={{
          title: "Translation",
          ...getHeaderOptions(theme),
        }}
      />
      <Stack.Screen
        name="words"
        options={{
          title: "Words",
          ...getHeaderOptions(theme),
          headerRight: () => <CreateButton route="./create-word" />,
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: "Categories",
          ...getHeaderOptions(theme),
          headerRight: () => <CreateButton route="./create-category" />,
        }}
      />
      <Stack.Screen
        name="create-category"
        options={{
          presentation: "modal",
          title: "Create Category",
          ...getHeaderOptions(theme),
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="create-word"
        options={{
          presentation: "modal",
          title: "Create Word",
          ...getHeaderOptions(theme),
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="save-translation"
        options={{
          presentation: "modal",
          title: "Save to Vocabulary",
          ...getHeaderOptions(theme),
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}

function BackButton() {
  const theme = useTheme();
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
      accessibilityLabel="Back"
    />
  );
}

interface CreateButtonProps {
  readonly route: string;
}

function CreateButton({ route }: CreateButtonProps) {
  const theme = useTheme();
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
      accessibilityLabel="Create"
    />
  );
}

const getHeaderOptions = (theme: MD3Theme) => {
  return {
    headerStyle: { backgroundColor: theme.colors.surfaceVariant },
    headerTintColor: theme.colors.onBackground,
    headerBackTitle: "Back",
    contentStyle: { backgroundColor: theme.colors.background },
  };
};
