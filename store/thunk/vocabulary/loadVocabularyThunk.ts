import { getAllCategories } from "@/model/service/categoryService";
import { getUserWords } from "@/model/service/wordService";
import { VocabularyState } from "@/store/slice/vocabularySlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const loadVocabularyThunk = createAsyncThunk<VocabularyState, SQLiteDatabase>(
    "vocabulary/loadVocabularyThunk", async (db) => {
        const words = await getUserWords(db);
        const categories = await getAllCategories(db);
        return {words, categories};
    }
);