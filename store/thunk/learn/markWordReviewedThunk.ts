import type { Word } from "@/model/entity/types";
import { reviewWord } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const markWordReviewedThunk = createAsyncThunk<number, { word: Word }>(
  "words/markWordReviewedThunk",
  async ({ word }) => {
    await reviewWord(word);
    return word.id;
  }
);
