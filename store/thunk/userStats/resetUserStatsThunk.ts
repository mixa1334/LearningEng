import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadStatsThunk } from "./loadStatsThunk";

//refactor!!!!!!!!!!!!!!!!
export const resetUserStatsThunk = createAsyncThunk<void, void>(
  "stats/resetUserStatsThunk",
  async (_, { dispatch }) => {
    await AsyncStorage.multiRemove([
      "streak",
      "lastLearningDate",
      "reviewedToday",
      "dailyGoal",
      "dailyGoalAchieve",
    ]);
    dispatch(loadStatsThunk());
  }
);
