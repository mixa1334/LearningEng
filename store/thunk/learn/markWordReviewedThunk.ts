import type { Word } from "@/model/entity/types";
import { reviewWord } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type SQLiteDatabase } from "expo-sqlite";

export const markWordReviewedThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/markWordReviewedThunk", async ({ db, word }) => {
  await reviewWord(db, word);
  return word.id;
});
