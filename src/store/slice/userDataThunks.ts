import { userDataService } from "@/src/service/userDataService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateStatsAfterLearnThunk = createAsyncThunk<{
  learnedToday: number;
  totalLearnedWords: number;
  streak: number;
  lastLearningDate: string;
  dailyGoalAchieve: boolean;
}>("userData/updateStatisticsAfterLearning", async () => await userDataService.updateAfterLearningWord());

export const updateStatsAfterReviewThunk = createAsyncThunk<{
  reviewedToday: number;
}>("userData/updateStatisticsAfterReviewing", async () => await userDataService.updateAfterReviewingWord());


