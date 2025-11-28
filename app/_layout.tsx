import { GoalAchieveOverlay } from "@/components/common/GoalAchieveOverlay";
import LoadingSpinner from "@/components/common/LoadingApp";
import { runMigrations } from "@/model/database/migrations";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { AppDispatch, store } from "@/store";
import { loadStatsThunk } from "@/store/thunk/userStats/loadStatsThunk";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense, useEffect } from "react";
import "react-native-reanimated";
import { Provider as ReduxProvider, useDispatch } from "react-redux";

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadStatsThunk());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <GoalAchieveOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SQLiteProvider
        databaseName="EnglishLearningApp.db"
        onInit={runMigrations}
        useSuspense
      >
        <ReduxProvider store={store}>
          <AppInitializer />
        </ReduxProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
