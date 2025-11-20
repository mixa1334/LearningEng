import LoadingSpinner from "@/components/LoadingApp";
import { runMigrations } from "@/model/database/migrations";
import { store } from "@/store";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Provider as ReduxProvider } from "react-redux";

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
       <SQLiteProvider databaseName="EnglishLearningApp.db" onInit={runMigrations} useSuspense>
        <ReduxProvider store={store}>
          <PaperProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </PaperProvider>
          </ReduxProvider>
       </SQLiteProvider>
    </Suspense>
  );
}
