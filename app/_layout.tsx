import LoadingSpinner from "@/components/LoadingApp";
import { runMigrations } from "@/model/database/migrations";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { store } from "@/store";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import "react-native-reanimated";
import { Provider as ReduxProvider } from "react-redux";

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SQLiteProvider
        databaseName="EnglishLearningApp.db"
        onInit={runMigrations}
        useSuspense
      >
        <ReduxProvider store={store}>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </ReduxProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
