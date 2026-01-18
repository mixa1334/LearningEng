import { GoalAchieveOverlay } from "@/src/components/common/GoalAchieveOverlay";
import { LanguageProvider } from "@/src/components/common/LanguageProvider";
import LoadingScreenSpinner from "@/src/components/common/LoadingScreenSpinner";
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

function AppInitializer() {
  useBootstrapSettings();
  const theme = useTheme();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <GoalAchieveOverlay />
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} hidden={false} />
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingScreenSpinner />}>
      <SQLiteProvider databaseName="EnglishLearningApp.db" onInit={runMigrations} useSuspense={true}>
        <ReduxProvider store={store}>
          <SafeAreaProvider>
            <AppInitializer />
          </SafeAreaProvider>
        </ReduxProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
