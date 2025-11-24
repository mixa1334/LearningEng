import { getCurrentDate } from "@/util/dateHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

export const updateStatsAfterLearnThunk = createAsyncThunk(
  "stats/updateStatsAfterLearnThunk",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const today = getCurrentDate();

    let reviewedToday = state.stats.reviewedToday;
    let streak = state.stats.streak;
    let lastLearningDate = state.stats.lastLearningDate;
    const dailyGoal = state.stats.dailyGoal;
    let dailyGoalAchieve = state.stats.dailyGoalAchieve;

    reviewedToday++;
    if (lastLearningDate !== today) {
      lastLearningDate = today;
    }
    if (!dailyGoalAchieve && dailyGoal === reviewedToday) {
      dailyGoalAchieve = true;
      streak++;
    }

    await AsyncStorage.multiSet([
      ["reviewedToday", String(reviewedToday)],
      ["streak", String(streak)],
      ["lastLearningDate", lastLearningDate],
      ["dailyGoalAchieve", String(dailyGoalAchieve)],
    ]);

    return { reviewedToday, streak, lastLearningDate, dailyGoalAchieve };
  }
);
