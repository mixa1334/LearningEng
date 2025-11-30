import { resetWordLearningProgress } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadDailyWordSetThunk } from "./loadDailyWordSetThunk";

export const resetWordLearningProgressThunk = createAsyncThunk<void, void>(
  "learn/resetWordLearningProgressThunk",
  async (_, { dispatch }) => {
    await resetWordLearningProgress();
    dispatch(loadDailyWordSetThunk());
  }
);
