import { getCurrentDate } from "@/util/dateHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";

export const updateStatsAfterLearnThunk = createAsyncThunk(
  "stats/updateAfterReview",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const today = getCurrentDate();

    let reviewedToday = state.stats.reviewedToday;
    let streak = state.stats.streak;
    let lastLearningDate = state.stats.lastLearningDate;
    const dailyGoal = state.stats.dailyGoal;

    reviewedToday++;
    if (lastLearningDate !== today) {
      lastLearningDate = today;
      if (reviewedToday === dailyGoal) streak++;
    }

    await AsyncStorage.multiSet([
      ["reviewedToday", String(reviewedToday)],
      ["streak", String(streak)],
      ["lastLearningDate", lastLearningDate],
    ]);

    return { reviewedToday, streak, lastLearningDate };
  }
);
