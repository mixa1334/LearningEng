import { Word } from "@/model/entity/types";
import { deleteUserWord, getUserWords } from "@/model/repository/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const removeWordThunk = createAsyncThunk<Word[], {db: SQLiteDatabase, wordToDelete: Word}>(
    "vocabulary/removeWordThunk",async({db, wordToDelete}) => {
        await deleteUserWord(db, wordToDelete);
        return await getUserWords(db);
    }
);