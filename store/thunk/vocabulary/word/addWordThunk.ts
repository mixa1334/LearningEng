import { NewWordDto } from "@/model/dto/NewWordDto";
import { Word } from "@/model/entity/types";
import { addNewWord, getUserWords } from "@/model/service/wordService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";
import { loadDailyWordSetThunk } from "../../learn/loadDailyWordSetThunk";

export const addWordThunk = createAsyncThunk<Word[], {db: SQLiteDatabase, newWord: NewWordDto}>(
    "vocabulary/addWordThunk", async ({db, newWord}, {dispatch}) => {
        await addNewWord(db, newWord);
        dispatch(loadDailyWordSetThunk({db}));
        return getUserWords(db);
    }
);