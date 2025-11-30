import type { Word } from "@/model/entity/types";
import {
  getDailyWordsToLearn,
  getDailyWordsToReview,
} from "@/model/service/wordService";
import { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadDailyWordSetThunk = createAsyncThunk<
  { wordsToLearn: Word[]; wordsToReview: Word[] },
  { dailyGoalOverload?: number } | void
>("words/loadDailyWordSetThunk", async (arg, { getState }) => {
  const state = getState() as RootState;
  const dailyGoalOverload = arg?.dailyGoalOverload;
  const dailyGoal = dailyGoalOverload ?? state.statistics.dailyGoal;
  const reviewedToday = state.statistics.reviewedToday;
  const needToLearn = dailyGoal - reviewedToday;
  let wordsToLearn: Word[] = [];
  if (needToLearn > 0) {
    wordsToLearn = await getDailyWordsToLearn(needToLearn);
  }
  const wordsToReview = await getDailyWordsToReview();
  return { wordsToLearn, wordsToReview };
});
