import { resetWordLearningProgress } from "@/model/repository/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";
import { loadDailyWordSetThunk } from "./loadDailyWordSetThunk";

export const resetWordLearningProgressThunk = createAsyncThunk<
  void,
  SQLiteDatabase
>("learn/resetWordLearningProgressThunk", async (db, { dispatch }) => {
  await resetWordLearningProgress(db);
  dispatch(loadDailyWordSetThunk({ db }));
});
