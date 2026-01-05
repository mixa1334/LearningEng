import { GoalAchieveOverlay } from "@/src/components/common/GoalAchieveOverlay";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { ThemeProvider } from "@/src/components/common/ThemeProvider";
import { runMigrations } from "@/src/database/migrations";
import { useBootstrapSettings } from "@/src/hooks/useBootstrapSettings";
import { store } from "@/src/store";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { StatusBar } from "react-native";
import { useTheme } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

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
          }}
        />
        <Stack.Screen
          name="CategoryVocabularyPage"
          options={{
            title: "Categories",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: theme.colors.surfaceVariant },
            headerTintColor: theme.colors.onSurfaceVariant,
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
