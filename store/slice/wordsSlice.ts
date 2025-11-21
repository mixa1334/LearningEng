import type { Word } from "@/model/entity/types";
import {
  getDailyWordsToLearn,
  getDailyWordsToReview,
  reviewWord,
  startLearningWord,
} from "@/model/repository/wordService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SQLiteDatabase } from "expo-sqlite";

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
  SQLiteDatabase
>("words/loadDailyWordSetThunk", async (db) => {
  const wordsToLearn = await getDailyWordsToLearn(db);
  const wordsToReview = await getDailyWordsToReview(db);
  return { wordsToLearn, wordsToReview };
});

export const markWordReviewedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/markWordReviewedThunk", async ({ db, word }) => {
  await reviewWord(db, word);
  return word.id;
});

export const startLearnWordThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/startLearnWordThunk", async ({ db, word }) => {
  await startLearningWord(db, word);
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
      .addCase(
        loadDailyWordSetThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ wordsToLearn: Word[]; wordsToReview: Word[] }>
        ) => {
          state.status = StateType.succeeded;
          state.wordsToLearn = action.payload.wordsToLearn;
          state.wordsToReview = action.payload.wordsToReview;
        }
      )
      .addCase(loadDailyWordSetThunk.rejected, (state, action) => {
        state.status = StateType.failed;
        state.error = action.error.message;
      })
      .addCase(
        markWordReviewedThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.wordsToReview = state.wordsToReview.filter(
            (w) => w.id !== action.payload
          );
        }
      )
      .addCase(
        startLearnWordThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.wordsToReview = state.wordsToReview.filter(
            (w) => w.id !== action.payload
          );
        }
      );
  },
});

export const wordsReducer = wordsSlice.reducer;
