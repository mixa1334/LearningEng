import type { Word } from "@/model/entity/types";
import { getDueWords, markWordLearned } from "@/model/repository/wordRepo";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SQLiteDatabase } from "expo-sqlite";

type WordsState = {
  items: Word[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
};

const initialState: WordsState = {
  items: [],
  status: "idle",
};

export const loadDueWords = createAsyncThunk<Word[], SQLiteDatabase>(
  "words/loadDueWords",
  async (db) => {
    return await getDueWords(db);
  }
);

export const markWordLearnedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; id: number }
>("words/markWordLearned", async ({ db, id }) => {
  await markWordLearned(db, id);
  return id;
});

const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDueWords.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadDueWords.fulfilled,
        (state, action: PayloadAction<Word[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(loadDueWords.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(
        markWordLearnedThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((w) => w.id !== action.payload);
        }
      );
  },
});

export const wordsReducer = wordsSlice.reducer;
