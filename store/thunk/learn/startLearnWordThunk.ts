import type { Word } from "@/model/entity/types";
import { startLearningWord } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateStatsAfterLearnThunk } from "../statistics/updateStatsAfterLearnThunk";

export const startLearnWordThunk = createAsyncThunk<number, { word: Word }>(
  "words/startLearnWordThunk",
  async ({ word }, { dispatch }) => {
    await startLearningWord(word);
    dispatch(updateStatsAfterLearnThunk());
    return word.id;
  }
);
