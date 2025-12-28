import { GoalAchieveOverlay } from "@/src/components/common/GoalAchieveOverlay";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { ThemeProvider } from "@/src/components/common/ThemeProvider";
import { useBootstrapSettings } from "@/src/hooks/useBootstrapSettings";
import { runMigrations } from "@/src/database/migrations";
import { store } from "@/src/store";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";


// todo: extract routes to separate file
function AppInitializer() {
  useBootstrapSettings();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GoalAchieveOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="TranslationPage" 
          options={{ headerShown: false}} />
          <Stack.Screen name="WordVocabularyPage" 
          options={{ headerShown: false}} />
          <Stack.Screen name="CategoryVocabularyPage" 
          options={{ headerShown: false}} />
        </Stack>
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
