import { GoalAchieveOverlay } from "@/src/components/common/GoalAchieveOverlay";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { ThemeProvider } from "@/src/components/common/ThemeProvider";
import { runMigrations } from "@/src/database/migrations";
import { useBootstrapSettings } from "@/src/hooks/useBootstrapSettings";
import { store } from "@/src/store";
import { router, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { StatusBar } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

function BackButton(color: string) {
  return (
    <IconButton
      icon="arrow-left"
      onPress={() => router.back()}
      iconColor={color}
      size={24}
      accessibilityLabel="Back"
    />
  );
}

function AppContent() {
  const theme = useTheme();

  return (
    <>
      <GoalAchieveOverlay />
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="TranslationPage"
          options={{
            title: "Translation",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: theme.colors.surfaceVariant },
            headerTintColor: theme.colors.onSurfaceVariant,
          }}
        />
        <Stack.Screen
          name="WordVocabularyPage"
          options={{
            title: "Words",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: theme.colors.surfaceVariant },
            headerTintColor: theme.colors.onSurfaceVariant,
            headerRight: () => (
              <IconButton
                icon="plus-circle-outline"
                onPress={() => router.push("/CreateWordModal")}
                iconColor={theme.colors.primary}
                size={24}
                accessibilityLabel="Create"
              />
            ),
          }}
        />
        <Stack.Screen
          name="CategoryVocabularyPage"
          options={{
            title: "Categories",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: theme.colors.surfaceVariant },
            headerTintColor: theme.colors.onSurfaceVariant,
            headerRight: () => (
              <IconButton
                icon="plus-circle-outline"
                onPress={() => router.push("/CreateCategoryModal")}
                iconColor={theme.colors.primary}
                size={24}
                accessibilityLabel="Create"
              />
            ),
          }}
        />
        <Stack.Screen
          name="CreateCategoryModal"
          options={{
            presentation: "modal",
            headerStyle: { backgroundColor: theme.colors.surfaceVariant },
            contentStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.onSurfaceVariant,
            title: "Create Category",
            headerLeft: () => BackButton(theme.colors.primary),
          }}
        />
        <Stack.Screen
          name="CreateWordModal"
          options={{
            presentation: "modal",
            headerStyle: { backgroundColor: theme.colors.surfaceVariant },
            contentStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.onSurfaceVariant,
            title: "Create Word",
            headerLeft: () => BackButton(theme.colors.primary),
          }}
        />
      </Stack>
    </>
  );
}

function AppInitializer() {
  useBootstrapSettings();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SQLiteProvider
        databaseName="EnglishLearningApp.db"
        onInit={runMigrations}
        useSuspense={true}
      >
        <ReduxProvider store={store}>
          <AppInitializer />
        </ReduxProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
