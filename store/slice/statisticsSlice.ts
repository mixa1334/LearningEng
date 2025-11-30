import { createSlice } from "@reduxjs/toolkit";
import { changeDailyGoalThunk } from "../thunk/statistics/changeDailyGoalThunk";
import { changeNameThunk } from "../thunk/statistics/changeNameThunk";
import { loadStatsThunk } from "../thunk/statistics/loadStatsThunk";
import { updateStatsAfterLearnThunk } from "../thunk/statistics/updateStatsAfterLearnThunk";

export type StatisticsState = {
  name: string;
  streak: number;
  lastLearningDate: string | null;
  reviewedToday: number;
  dailyGoal: number;
  dailyGoalAchieve: boolean;
};

const initialStatisticsState: StatisticsState = {
  name: "User",
  streak: 0,
  lastLearningDate: null,
  reviewedToday: 0,
  dailyGoal: 5,
  dailyGoalAchieve: false,
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: initialStatisticsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateStatsAfterLearnThunk.fulfilled, (state, action) => {
      state.reviewedToday = action.payload.reviewedToday;
      state.streak = action.payload.streak;
      state.lastLearningDate = action.payload.lastLearningDate;
      state.dailyGoalAchieve = action.payload.dailyGoalAchieve;
    });
    builder.addCase(loadStatsThunk.fulfilled, (state, action) => {
      return { ...initialStatisticsState, ...action.payload };
    });
    builder.addCase(changeDailyGoalThunk.fulfilled, (state, action) => {
      state.dailyGoal = action.payload.dailyGoal;
      state.streak = action.payload.streak;
      state.dailyGoalAchieve = action.payload.dailyGoalAchieve;
    });
    builder.addCase(changeNameThunk.fulfilled, (state, action) => {
      state.name = action.payload;
    });
  },
});

export const statisticsReducer = statisticsSlice.reducer;
