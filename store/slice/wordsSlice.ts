import type { Word } from "@/model/entity/types";
import {
  getDailyWordsToLearn,
  getDailyWordsToReview,
  markWordCompletelyLearned,
  reviewWord,
  startLearningWord,
} from "@/model/repository/wordService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type SQLiteDatabase } from "expo-sqlite";
import { RootState } from "..";
import { updateStatsAfterLearnThunk } from "../thunk/userStats/updateStatsAfterLearnThunk";

enum StateType {
  idle = "idle",
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
}

type WordsState = {
  wordsToReview: Word[];
  wordsToLearn: Word[];
  status: StateType;
  error?: string;
};

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

export const markWordReviewedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/markWordReviewedThunk", async ({ db, word }) => {
  await reviewWord(db, word);
  return word.id;
});

export const loopWordInReviewThunk = createAsyncThunk<
  Word[],
  void,
  { state: { words: { wordsToReview: Word[] } } }
>("words/loopWordInReviewThunk", async (_, { getState }) => {
  const current = getState().words.wordsToReview;
  if (current.length <= 1) return current;
  return [...current.slice(1), current[0]];
});

export const startLearnWordThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/startLearnWordThunk", async ({ db, word }, { dispatch }) => {
  await startLearningWord(db, word);
  dispatch(updateStatsAfterLearnThunk());
  return word.id;
});

export const markWordCompletelyLearnedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/markWordCompletelyLearned", async ({ db, word }, { dispatch }) => {
  await markWordCompletelyLearned(db, word);
  // dispatch(updateStatsAfterLearnThunk());
  return word.id;
});

const wordsSlice = createSlice({
  name: "words",
  initialState: {
    wordsToReview: [],
    wordsToLearn: [],
    status: StateType.loading,
  } as WordsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDailyWordSetThunk.pending, (state) => {
        state.status = StateType.loading;
      })
      .addCase(loadDailyWordSetThunk.fulfilled, (state, action) => {
        state.status = StateType.succeeded;
        state.wordsToLearn = action.payload.wordsToLearn;
        state.wordsToReview = action.payload.wordsToReview;
      })
      .addCase(loadDailyWordSetThunk.rejected, (state, action) => {
        state.status = StateType.failed;
        state.error = action.error.message;
      })
      .addCase(markWordReviewedThunk.fulfilled, (state, action) => {
        state.wordsToReview = state.wordsToReview.filter(
          (w) => w.id !== action.payload
        );
      })
      .addCase(startLearnWordThunk.fulfilled, (state, action) => {
        state.wordsToLearn = state.wordsToLearn.filter(
          (w) => w.id !== action.payload
        );
      })
      .addCase(markWordCompletelyLearnedThunk.fulfilled, (state, action) => {
        state.wordsToLearn = state.wordsToLearn.filter(
          (w) => w.id !== action.payload
        );
      })
      .addCase(loopWordInReviewThunk.fulfilled, (state, action) => {
        state.wordsToReview = action.payload;
      });
  },
});

export const wordsReducer = wordsSlice.reducer;
