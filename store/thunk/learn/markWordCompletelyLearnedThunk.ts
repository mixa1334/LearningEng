import type { Word } from "@/model/entity/types";
import { markWordCompletelyLearned } from "@/model/repository/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type SQLiteDatabase } from "expo-sqlite";

export const markWordCompletelyLearnedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/markWordCompletelyLearned", async ({ db, word }) => {
  await markWordCompletelyLearned(db, word);
  return word.id;
});
