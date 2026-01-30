import type { Word } from "@/src/entity/types";
import {
  getDailyWordsToLearn,
  getDailyWordsToReview,
  markWordCompletelyLearned,
  resetWordLearningProgress,
  reviewWord,
  startLearningWord,
} from "@/src/service/wordService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../types";
import {
  updateStatsAfterLearnThunk,
  updateStatsAfterReviewThunk,
} from "./userDataThunks";

export type LearnState = {
  wordsToReview: Word[];
  wordsToLearn: Word[];
  reviewWord: Word | undefined;
  learnWord: Word | undefined;
  error: string | undefined;
};

const initialLearnState: LearnState = {
  wordsToReview: [],
  wordsToLearn: [],
  reviewWord: undefined,
  learnWord: undefined,
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

export const loadExtraDailyWordSetThunk = createAsyncThunk<Word[]>(
  "learn/loadExtraDailyWordSet",
  async (_, { getState }) => {
    const dailyGoal = (getState() as RootState).userData.dailyGoal;
    const wordsToLearn = await getDailyWordsToLearn(dailyGoal);
    return wordsToLearn;
  }
);

export const markWordCompletelyLearnedThunk = createAsyncThunk<Word[], Word>(
  "learn/wordsToLearn/markWordCompletelyLearned",
  async (word, { getState }) => {
    await markWordCompletelyLearned(word);
    const wordsToLearn = (getState() as RootState).learn.wordsToLearn;
    return wordsToLearn.filter((w) => w.id !== word.id);
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

export const resetLearningStatsThunk = createAsyncThunk<void, void>(
  "learn/resetLearningStats",
  async (_, { dispatch }) => {
    await resetWordLearningProgress();
    dispatch(loadDailyWordSetThunk());
  }
);

export const startLearnWordThunk = createAsyncThunk<Word[], Word>(
  "learn/wordsToLearn/startLearnWord",
  async (word, { dispatch, getState }) => {
    await startLearningWord(word);
    dispatch(updateStatsAfterLearnThunk());
    const wordsToLearn = (getState() as RootState).learn.wordsToLearn;
    return wordsToLearn.filter((w) => w.id !== word.id);
  }
);

const extractWord = (words: Word[]) =>
  words.length > 0 ? words[0] : undefined;

const learnSlice = createSlice({
  name: "learn",
  initialState: initialLearnState,
  reducers: {
    skipWordWhenReviewing: (state) => {
      let words = state.wordsToReview;
      if (words.length <= 1) return;
      words = [...words.slice(1), words[0]];
      state.reviewWord = words[0];
      state.wordsToReview = words;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDailyWordSetThunk.fulfilled, (state, action) => {
        const wordsToReview = action.payload.wordsToReview;
        state.wordsToReview = wordsToReview;
        state.reviewWord = extractWord(wordsToReview);

        const wordsToLearn = action.payload.wordsToLearn;
        state.wordsToLearn = wordsToLearn;
        state.learnWord = extractWord(wordsToLearn);

        // state.error = undefined;
      })
      .addCase(loadDailyWordSetThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loadExtraDailyWordSetThunk.fulfilled, (state, action) => {
        const wordsToLearn = action.payload;
        state.wordsToLearn = wordsToLearn;
        state.learnWord = extractWord(wordsToLearn);
      })
      .addCase(markWordReviewedThunk.fulfilled, (state, action) => {
        const wordsToReview = action.payload;
        state.wordsToReview = wordsToReview;
        state.reviewWord = extractWord(wordsToReview);
      })
      .addCase(markWordCompletelyLearnedThunk.fulfilled, (state, action) => {
        const wordsToLearn = action.payload;
        state.wordsToLearn = wordsToLearn;
        state.learnWord = extractWord(wordsToLearn);
      })
      .addCase(startLearnWordThunk.fulfilled, (state, action) => {
        const wordsToLearn = action.payload;
        state.wordsToLearn = wordsToLearn;
        state.learnWord = extractWord(wordsToLearn);
      });
  },
});

export const { skipWordWhenReviewing } = learnSlice.actions;

export const learnReducer = learnSlice.reducer;
