import { getCurrentDate } from "@/util/dateHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

export const updateStatsAfterLearnThunk = createAsyncThunk(
  "stats/updateStatsAfterLearnThunk",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const today = getCurrentDate();

    let reviewedToday = state.statistics.reviewedToday;
    let streak = state.statistics.streak;
    let lastLearningDate = state.statistics.lastLearningDate;
    const dailyGoal = state.statistics.dailyGoal;
    let dailyGoalAchieve = state.statistics.dailyGoalAchieve;

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
