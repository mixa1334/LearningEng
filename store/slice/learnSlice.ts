import type { Word } from "@/model/entity/types";
import { createSlice } from "@reduxjs/toolkit";
import { StateType } from "../stateType";
import { loadDailyWordSetThunk } from "../thunk/learn/loadDailyWordSetThunk";
import { markWordCompletelyLearnedThunk } from "../thunk/learn/markWordCompletelyLearnedThunk";
import { markWordNotReviewedThunk } from "../thunk/learn/markWordNotReviewedThunk";
import { markWordReviewedThunk } from "../thunk/learn/markWordReviewedThunk";
import { startLearnWordThunk } from "../thunk/learn/startLearnWordThunk";

export type LearnState = {
  wordsToReview: Word[];
  wordsToLearn: Word[];
  status: StateType;
  error?: string;
};

const initialLearnState: LearnState = {
  wordsToReview: [],
  wordsToLearn: [],
  status: StateType.loading,
};

const learnSlice = createSlice({
  name: "learn",
  initialState: initialLearnState,
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
      .addCase(markWordNotReviewedThunk.fulfilled, (state, action) => {
        state.wordsToReview = action.payload;
      });
  },
});

export const learnReducer = learnSlice.reducer;
