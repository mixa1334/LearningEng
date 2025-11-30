import { getAllCategories } from "@/model/service/categoryService";
import { getPreloadedWords, getUserWords } from "@/model/service/wordService";
import { VocabularyState } from "@/store/slice/vocabularySlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadVocabularyThunk = createAsyncThunk<VocabularyState>(
  "vocabulary/loadVocabularyThunk",
  async () => {
    const userWords = await getUserWords();
    const preloadedWords = await getPreloadedWords();
    const categories = await getAllCategories();
    return { userWords, categories, preloadedWords };
  }
);