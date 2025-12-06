import { UserData } from "@/model/entity/types";
import { changeDailyGoal, changeName, loadUserData, resetUserData } from "@/model/service/userDataService";
import { DEFAULT_USER_DATA } from "@/model/storage/userDataStorageHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadDailyWordSetThunk } from "./learnSlice";
import { updateStatsAfterLearnThunk, updateStatsAfterReviewThunk } from "./userDataThunks";

const initialUserDataState: UserData = {
  ...DEFAULT_USER_DATA,
};

export const changeDailyGoalThunk = createAsyncThunk<
  {
    dailyGoal: number;
    streak: number;
    dailyGoalAchieve: boolean;
  },
  { newDailyGoal: number }
>("userData/changeDailyGoal", async ({ newDailyGoal }, { dispatch }) => {
  const result = await changeDailyGoal(newDailyGoal);
  dispatch(loadDailyWordSetThunk({ dailyGoalOverload: result.dailyGoal }));
  return result;
});

export const changeNameThunk = createAsyncThunk<string, string>("userData/changeName", async (newName) => {
  await changeName(newName);
  return newName;
});

export const loadUserDataThunk = createAsyncThunk<UserData>("userData/loadUserData", async () => await loadUserData());

export const resetUserDataThunk = createAsyncThunk<UserData>("userData/resetUserData", async () => await resetUserData());

const userDataSlice = createSlice({
  name: "userData",
  initialState: initialUserDataState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(changeDailyGoalThunk.fulfilled, (state, action) => {
      state.dailyGoal = action.payload.dailyGoal;
      state.streak = action.payload.streak;
      state.dailyGoalAchieve = action.payload.dailyGoalAchieve;
    });
    builder.addCase(changeNameThunk.fulfilled, (state, action) => {
      state.name = action.payload;
    });
    builder.addCase(loadUserDataThunk.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(resetUserDataThunk.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(updateStatsAfterLearnThunk.fulfilled, (state, action) => {
      state.learnedToday = action.payload.learnedToday;
      state.totalLearnedWords = action.payload.totalLearnedWords;
      state.streak = action.payload.streak;
      state.lastLearningDate = action.payload.lastLearningDate;
      state.dailyGoalAchieve = action.payload.dailyGoalAchieve;
    });
    builder.addCase(updateStatsAfterReviewThunk.fulfilled, (state, action) => {
      state.reviewedToday = action.payload.reviewedToday;
    });
  },
});

export const userDataReducer = userDataSlice.reducer;
