import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

//refactor!!!!!!!!!!!!!!!!
export const resetUserStatsThunk = createAsyncThunk<void, void>(
  "stats/resetUserStatsThunk",
  async () => {
    await AsyncStorage.multiRemove([
      "name",
      "streak",
      "lastLearningDate",
      "reviewedToday",
      "dailyGoal",
      "dailyGoalAchieve",
    ]);
  }
);
