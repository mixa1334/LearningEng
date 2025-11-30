import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";
import { RootState } from "../..";
import { loadDailyWordSetThunk } from "../learn/loadDailyWordSetThunk";

// REFACTOR!!!!!!!!!!!!!!!!!!!!!!!
export const changeDailyGoalThunk = createAsyncThunk<
  {
    dailyGoal: number;
    streak: number;
    dailyGoalAchieve: boolean;
  },
  { newDailyGoal: number; db: SQLiteDatabase }
>(
  "stats/changeDailyGoalThunk",
  async ({ newDailyGoal, db }, { getState, dispatch }) => {
    const state = getState() as RootState;
    newDailyGoal = Math.max(1, newDailyGoal);
    let dailyGoal = state.stats.dailyGoal;
    let reviewedToday = state.stats.reviewedToday;
    let streak = state.stats.streak;
    let dailyGoalAchieve = state.stats.dailyGoalAchieve;
    if (
      !dailyGoalAchieve &&
      newDailyGoal < dailyGoal &&
      reviewedToday < dailyGoal &&
      reviewedToday >= newDailyGoal
    ) {
      streak++;
      dailyGoalAchieve = true;
    }
    if (
      streak > 0 &&
      dailyGoalAchieve &&
      newDailyGoal > dailyGoal &&
      reviewedToday >= dailyGoal &&
      reviewedToday < newDailyGoal
    ) {
      streak--;
      dailyGoalAchieve = false;
    }

    await AsyncStorage.multiSet([
      ["dailyGoal", String(newDailyGoal)],
      ["streak", String(streak)],
      ["dailyGoalAchieve", String(dailyGoalAchieve)],
    ]);
    dispatch(loadDailyWordSetThunk({ db, dailyGoalOverload: newDailyGoal }));
    return { dailyGoal: newDailyGoal, streak, dailyGoalAchieve };
  }
);
