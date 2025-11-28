import type { Word } from "@/model/entity/types";
import { startLearningWord } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { type SQLiteDatabase } from "expo-sqlite";
import { updateStatsAfterLearnThunk } from "../userStats/updateStatsAfterLearnThunk";

export const startLearnWordThunk = createAsyncThunk<
  number,
  { db: SQLiteDatabase; word: Word }
>("words/startLearnWordThunk", async ({ db, word }, { dispatch }) => {
  await startLearningWord(db, word);
  dispatch(updateStatsAfterLearnThunk());
  return word.id;
});
