import { Word } from "@/model/entity/types";
import { addNewWord, getUserWords, NewWordDto } from "@/model/repository/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";
import { loadDailyWordSetThunk } from "../../learn/loadDailyWordSetThunk";

export const addWordThunk = createAsyncThunk<Word[], {db: SQLiteDatabase, newWord: NewWordDto}>(
    "vocabulary/addWordThunk", async ({db, newWord}, {dispatch}) => {
        await addNewWord(db, newWord);
        dispatch(loadDailyWordSetThunk({db}));
        return await getUserWords(db);
    }
);