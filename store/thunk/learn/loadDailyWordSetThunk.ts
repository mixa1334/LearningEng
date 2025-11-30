import type { Word } from "@/model/entity/types";
import {
    getDailyWordsToLearn,
    getDailyWordsToReview,
} from "@/model/service/wordService";
import { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type SQLiteDatabase } from "expo-sqlite";

export const loadDailyWordSetThunk = createAsyncThunk<
  { wordsToLearn: Word[]; wordsToReview: Word[] },
  { db: SQLiteDatabase; dailyGoalOverload?: number }
>(
  "words/loadDailyWordSetThunk",
  async ({ db, dailyGoalOverload }, { getState }) => {
    const state = getState() as RootState;
    const dailyGoal = dailyGoalOverload ?? state.stats.dailyGoal;
    const reviewedToday = state.stats.reviewedToday;
    const needToLearn = dailyGoal - reviewedToday;
    let wordsToLearn: Word[] = [];
    if (needToLearn > 0) {
      wordsToLearn = await getDailyWordsToLearn(db, needToLearn);
    }
    const wordsToReview = await getDailyWordsToReview(db);
    return { wordsToLearn, wordsToReview };
  }
);
