import { Category, Word } from "@/model/entity/types";
import { createSlice } from "@reduxjs/toolkit";
import { addCategoryThunk } from "../thunk/vocabulary/category/addCategoryThunk";
import { loadVocabularyThunk } from "../thunk/vocabulary/loadVocabularyThunk";
import { addWordThunk } from "../thunk/vocabulary/word/addWordThunk";
import { removeWordThunk } from "../thunk/vocabulary/word/removeWordThunk";

export type VocabularyState = {
  words: Word[];
  categories: Category[];
};

const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState: { words: [], categories: [] } as VocabularyState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadVocabularyThunk.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(removeWordThunk.fulfilled, (state, action) => {
      state.words = action.payload;
    });
    builder.addCase(addWordThunk.fulfilled, (state, action) => {
      state.words = action.payload;
    });
    builder.addCase(addCategoryThunk.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export const vocabularyReducer = vocabularySlice.reducer;
