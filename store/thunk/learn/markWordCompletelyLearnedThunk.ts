import type { Word } from "@/model/entity/types";
import { markWordCompletelyLearned } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const markWordCompletelyLearnedThunk = createAsyncThunk<
  number,
  { word: Word }
>("words/markWordCompletelyLearned", async ({ word }) => {
  await markWordCompletelyLearned(word);
  return word.id;
});
