import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

export const changeDailyGoalThunk = createAsyncThunk<
  {
    dailyGoal: number;
    streak: number;
  },
  number
>("stats/changeDailyGoalThunk", async (newDailyGoal, { getState }) => {
  const state = getState() as RootState;
  let dailyGoal = state.stats.dailyGoal;
  let reviewedToday = state.stats.reviewedToday;
  let streak = state.stats.streak;
  if (
    newDailyGoal < dailyGoal &&
    reviewedToday < dailyGoal &&
    reviewedToday >= newDailyGoal
  ) {
    streak++;
  }
  if (
    newDailyGoal > dailyGoal &&
    reviewedToday >= dailyGoal &&
    reviewedToday < newDailyGoal
  ) {
    streak--;
  }
  await AsyncStorage.setItem("dailyGoal", String(newDailyGoal));
  await AsyncStorage.setItem("streak", String(streak));
  return { dailyGoal: newDailyGoal, streak };
});
