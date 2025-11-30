import { Category, Word } from "@/model/entity/types";
import { createSlice } from "@reduxjs/toolkit";
import { addCategoryThunk } from "../thunk/vocabulary/category/addCategoryThunk";
import { editCategoryThunk } from "../thunk/vocabulary/category/editCategoryThunk";
import { removeCategoryThunk } from "../thunk/vocabulary/category/removeCategoryThunk";
import { loadVocabularyThunk } from "../thunk/vocabulary/loadVocabularyThunk";
import { addWordThunk } from "../thunk/vocabulary/word/addWordThunk";
import { editWordThunk } from "../thunk/vocabulary/word/editWordThunk";
import { removeWordThunk } from "../thunk/vocabulary/word/removeWordThunk";

export type VocabularyState = {
  userWords: Word[];
  preloadedWords: Word[];
  categories: Category[];
};

const initialVocabularyState: VocabularyState = {
  userWords: [],
  preloadedWords: [],
  categories: [],
};

const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState: initialVocabularyState,
  reducers: {},
  extraReducers: (builder) => {
    // vocabulary
    builder.addCase(loadVocabularyThunk.fulfilled, (state, action) => {
      return action.payload;
    });

    // user words
    builder.addCase(removeWordThunk.fulfilled, (state, action) => {
      state.userWords = action.payload;
    });
    builder.addCase(addWordThunk.fulfilled, (state, action) => {
      state.userWords = action.payload;
    });
    builder.addCase(editWordThunk.fulfilled, (state, action) => {
      state.userWords = action.payload;
    });

    // categories
    builder.addCase(addCategoryThunk.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(removeCategoryThunk.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(editCategoryThunk.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export const vocabularyReducer = vocabularySlice.reducer;
