import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateAfterLearningWord, updateAfterReviewingWord } from "@/model/service/userDataService";

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


