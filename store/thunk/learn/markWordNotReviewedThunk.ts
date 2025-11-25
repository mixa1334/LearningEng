import type { Word } from "@/model/entity/types";
import { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const markWordNotReviewedThunk = createAsyncThunk<Word[], void>(
  "learn/markWordNotReviewedThunk",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const current = state.learn.wordsToReview;
    if (current.length <= 1) return current;
    return [...current.slice(1), current[0]];
  }
);
