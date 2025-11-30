import { getAllCategories } from "@/model/service/categoryService";
import { getPreloadedWords, getUserWords } from "@/model/service/wordService";
import { VocabularyState } from "@/store/slice/vocabularySlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SQLiteDatabase } from "expo-sqlite";

export const loadVocabularyThunk = createAsyncThunk<VocabularyState, SQLiteDatabase>(
    "vocabulary/loadVocabularyThunk", async (db) => {
        const words = await getUserWords(db);
        const categories = await getAllCategories(db);
        const preloadedWords = await getPreloadedWords(db);
        return {words, categories, preloadedWords};
    }
);