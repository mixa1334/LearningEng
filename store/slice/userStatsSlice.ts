import { createSlice } from "@reduxjs/toolkit";
import { changeDailyGoalThunk } from "../thunk/userStats/changeDailyGoalThunk";
import { changeNameThunk } from "../thunk/userStats/changeNameThunk";
import { loadStatsThunk } from "../thunk/userStats/loadStatsThunk";
import { resetUserStatsThunk } from "../thunk/userStats/resetUserStatsThunk";
import { updateStatsAfterLearnThunk } from "../thunk/userStats/updateStatsAfterLearnThunk";

export type StatsState = {
  name: string;
  streak: number;
  lastLearningDate: string | null;
  reviewedToday: number;
  dailyGoal: number;
  dailyGoalAchieve: boolean;
};

export const initialState: StatsState = {
  name: "User",
  streak: 0,
  lastLearningDate: null,
  reviewedToday: 0,
  dailyGoal: 5,
  dailyGoalAchieve: false,
};

const userStatsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateStatsAfterLearnThunk.fulfilled, (state, action) => {
      const { reviewedToday, streak, lastLearningDate, dailyGoalAchieve } =
        action.payload;
      state.reviewedToday = reviewedToday;
      state.streak = streak;
      state.lastLearningDate = lastLearningDate;
      state.dailyGoalAchieve = dailyGoalAchieve;
    });
    builder.addCase(loadStatsThunk.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(changeDailyGoalThunk.fulfilled, (state, action) => {
      const { dailyGoal, streak, dailyGoalAchieve } = action.payload;
      state.dailyGoal = dailyGoal;
      state.streak = streak;
      state.dailyGoalAchieve = dailyGoalAchieve;
    });
    builder.addCase(changeNameThunk.fulfilled, (state, action) => {
      state.name = action.payload;
    });
    builder.addCase(resetUserStatsThunk.fulfilled, (state, action) => {
      return initialState;
    });
  },
});

export const userStatsReducer = userStatsSlice.reducer;
