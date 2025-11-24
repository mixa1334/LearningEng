import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

// REFACTOR!!!!!!!!!!!!!!!!!!!!!!!
export const changeDailyGoalThunk = createAsyncThunk<
  {
    dailyGoal: number;
    streak: number;
    dailyGoalAchieve: boolean;
  },
  number
>("stats/changeDailyGoalThunk", async (newDailyGoal, { getState }) => {
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

  return { dailyGoal: newDailyGoal, streak, dailyGoalAchieve };
});
