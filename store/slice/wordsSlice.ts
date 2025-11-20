import type { Word } from "@/model/entity/types";
import { getDailyWords, markWordLearned } from "@/model/repository/wordService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SQLiteDatabase } from "expo-sqlite";

type WordsState = {
  items: Word[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
};

export const loadDailyWordsThunk = createAsyncThunk<Word[], SQLiteDatabase>(
  "words/loadDailyWordsThunk",
  async (db) => {
    return await getDailyWords(db);
  }
);

export const markWordReviewedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; id: number }
>("words/markWordReviewedThunk", async ({ db, id }) => {
  await markWordLearned(db, id);
  return id;
});

const wordsSlice = createSlice({
  name: "words",
  initialState: {
    items: [],
    status: "idle",
  } as WordsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDailyWordsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadDailyWordsThunk.fulfilled,
        (state, action: PayloadAction<Word[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(loadDailyWordsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(
        markWordReviewedThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((w) => w.id !== action.payload);
        }
      );
  },
});

export const wordsReducer = wordsSlice.reducer;
