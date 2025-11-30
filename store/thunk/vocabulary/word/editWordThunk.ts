import { Word } from "@/model/entity/types";
import { editUserWord, getUserWords } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const editWordThunk = createAsyncThunk<
  Word[],
  { db: SQLiteDatabase; wordToEdit: Word }
>("vocabulary/editWordThunk", async ({ db, wordToEdit }) => {
  await editUserWord(db, wordToEdit);
  return getUserWords(db);
});
