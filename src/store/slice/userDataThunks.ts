import { updateAfterLearningWord, updateAfterReviewingWord } from "@/src/model/service/userDataService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateStatsAfterLearnThunk = createAsyncThunk<{
  learnedToday: number;
  totalLearnedWords: number;
  streak: number;
  lastLearningDate: string;
  dailyGoalAchieve: boolean;
}>("userData/updateStatisticsAfterLearning", async () => await updateAfterLearningWord());

export const updateStatsAfterReviewThunk = createAsyncThunk<{
  reviewedToday: number;
}>("userData/updateStatisticsAfterReviewing", async () => await updateAfterReviewingWord());


