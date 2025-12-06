import type { Word } from "@/model/entity/types";
import {
  getDailyWordsToLearn,
  getDailyWordsToReview,
  markWordCompletelyLearned,
  resetWordLearningProgress,
  reviewWord,
  startLearningWord,
} from "@/model/service/wordService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { updateStatsAfterLearnThunk, updateStatsAfterReviewThunk } from "./userDataThunks";

export type LearnState = {
  wordsToReview: Word[];
  wordsToLearn: Word[];
  error: string | undefined;
};

const initialLearnState: LearnState = {
  wordsToReview: [],
  wordsToLearn: [],
  error: undefined,
};

export const loadDailyWordSetThunk = createAsyncThunk<
  { wordsToLearn: Word[]; wordsToReview: Word[] },
  { dailyGoalOverload?: number } | void
>("learn/loadDailyWordSet", async (arg, { getState }) => {
  const userData = (getState() as RootState).userData;
  const dailyGoal = arg?.dailyGoalOverload ?? userData.dailyGoal;
  const needToLearn = dailyGoal - userData.learnedToday;
  let wordsToLearn: Word[] = [];
  if (needToLearn > 0) {
    wordsToLearn = await getDailyWordsToLearn(needToLearn);
  }
  const wordsToReview = await getDailyWordsToReview();
  return { wordsToLearn, wordsToReview };
});

export const markWordCompletelyLearnedThunk = createAsyncThunk<Word[], Word>(
  "learn/wordsToLearn/markWordCompletelyLearned",
  async (word, { getState }) => {
    await markWordCompletelyLearned(word);
    const wordsToLearn = (getState() as RootState).learn.wordsToLearn;
    return wordsToLearn.filter((w) => w.id !== word.id);
  }
);

export const markWordNotReviewedThunk = createAsyncThunk<Word[]>(
  "learn/wordsToReview/markWordNotReviewed",
  async (_, { getState }) => {
    const wordsToReview = (getState() as RootState).learn.wordsToReview;
    if (wordsToReview.length <= 1) return wordsToReview;
    return [...wordsToReview.slice(1), wordsToReview[0]];
  }
);

export const markWordReviewedThunk = createAsyncThunk<Word[], Word>(
  "learn/wordsToReview/markWordReviewed",
  async (word, { getState, dispatch }) => {
    await reviewWord(word);
    dispatch(updateStatsAfterReviewThunk());
    const wordsToReview = (getState() as RootState).learn.wordsToReview;
    return wordsToReview.filter((w) => w.id !== word.id);
  }
);

export const resetLearningStatsThunk = createAsyncThunk<void, void>("learn/resetLearningStats", async (_, { dispatch }) => {
  await resetWordLearningProgress();
  dispatch(loadDailyWordSetThunk());
});

export const startLearnWordThunk = createAsyncThunk<Word[], Word>(
  "learn/wordsToLearn/startLearnWord",
  async (word, { dispatch, getState }) => {
    await startLearningWord(word);
    dispatch(updateStatsAfterLearnThunk());
    const wordsToLearn = (getState() as RootState).learn.wordsToLearn;
    return wordsToLearn.filter((w) => w.id !== word.id);
  }
);

const learnSlice = createSlice({
  name: "learn",
  initialState: initialLearnState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDailyWordSetThunk.fulfilled, (state, action) => {
        state.wordsToReview = action.payload.wordsToReview;
        state.wordsToLearn = action.payload.wordsToLearn;
        state.error = undefined;
      })
      .addCase(loadDailyWordSetThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(markWordReviewedThunk.fulfilled, (state, action) => {
        state.wordsToReview = action.payload;
      })
      .addCase(markWordCompletelyLearnedThunk.fulfilled, (state, action) => {
        state.wordsToLearn = action.payload;
      })
      .addCase(markWordNotReviewedThunk.fulfilled, (state, action) => {
        state.wordsToReview = action.payload;
      })
      .addCase(startLearnWordThunk.fulfilled, (state, action) => {
        state.wordsToLearn = action.payload;
      });
  },
});

export const learnReducer = learnSlice.reducer;
