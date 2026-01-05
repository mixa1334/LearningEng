import { NewCategoryDto } from "@/src/dto/NewCategoryDto";
import { NewWordDto } from "@/src/dto/NewWordDto";
import { Category, EntityType, Word } from "@/src/entity/types";
import { addNewCategory, deleteUserCategory, editUserCategory, getCategoriesByType } from "@/src/service/categoryService";
import { addNewWord, deleteUserWord, editUserWord, getWordsByCriteria, WordCriteria } from "@/src/service/wordService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadDailyWordSetThunk } from "./learnSlice";
import { resetPracticeSetThunk } from "./practiceSlice";

export type VocabularyState = {
  userWords: Word[];
  preloadedWords: Word[];
  userCategories: Category[];
  allCategories: Category[];
};

const initialVocabularyState: VocabularyState = {
  userWords: [],
  preloadedWords: [],
  userCategories: [],
  allCategories: [],
};

export const addCategoryThunk = createAsyncThunk<Category[], NewCategoryDto>(
  "vocabulary/addCategoryThunk",
  async (newCategory) => {
    await addNewCategory(newCategory);
    return getCategoriesByType(EntityType.useradd);
  }
);

export const editCategoryThunk = createAsyncThunk<Category[], Category>(
  "vocabulary/editCategoryThunk",
  async (categoryToEdit) => {
    await editUserCategory(categoryToEdit);
    return getCategoriesByType(EntityType.useradd);
  }
);

export const removeCategoryThunk = createAsyncThunk<Category[], Category>(
  "vocabulary/removeCategoryThunk",
  async (categoryToDelete) => {
    await deleteUserCategory(categoryToDelete);
    return getCategoriesByType(EntityType.useradd);
  }
);

//todo some refactor with update word mb
export const addWordThunk = createAsyncThunk<Word[], NewWordDto>("vocabulary/addWordThunk", async (newWord, { dispatch }) => {
  await addNewWord(newWord);
  dispatch(loadDailyWordSetThunk());
  dispatch(resetPracticeSetThunk());
  return getWordsByCriteria(new WordCriteria().appendType(EntityType.useradd));
});

export const editWordThunk = createAsyncThunk<Word[], Word>("vocabulary/editWordThunk", async (wordToEdit, { dispatch }) => {
  await editUserWord(wordToEdit);
  dispatch(loadDailyWordSetThunk());
  dispatch(resetPracticeSetThunk());
  return getWordsByCriteria(new WordCriteria().appendType(EntityType.useradd));
});

export const removeWordThunk = createAsyncThunk<Word[], Word>(
  "vocabulary/removeWordThunk",
  async (wordToDelete, { dispatch }) => {
    await deleteUserWord(wordToDelete);
    dispatch(loadDailyWordSetThunk());
    dispatch(resetPracticeSetThunk());
    return getWordsByCriteria(new WordCriteria().appendType(EntityType.useradd));
  }
);

export const loadVocabularyThunk = createAsyncThunk<VocabularyState>("vocabulary/loadVocabularyThunk", async () => {
  const userWords = await getWordsByCriteria(new WordCriteria().appendType(EntityType.useradd));
  const preloadedWords = await getWordsByCriteria(new WordCriteria().appendType(EntityType.preloaded));
  const userCategories = await getCategoriesByType(EntityType.useradd);
  const preloadedCategories = await getCategoriesByType(EntityType.preloaded);
  return {
    userWords,
    preloadedWords,
    userCategories,
    allCategories: [...userCategories, ...preloadedCategories],
  };
});

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
    const syncCategories = (state: VocabularyState, userCategories: Category[]) => {
      state.userCategories = userCategories;
      const preloadedCategories = state.allCategories.filter(
        (category) => category.type === EntityType.preloaded
      );
      state.allCategories = [...userCategories, ...preloadedCategories];
    };

    builder.addCase(addCategoryThunk.fulfilled, (state, action) => {
      syncCategories(state, action.payload);
    });
    builder.addCase(removeCategoryThunk.fulfilled, (state, action) => {
      syncCategories(state, action.payload);
    });
    builder.addCase(editCategoryThunk.fulfilled, (state, action) => {
      syncCategories(state, action.payload);
    });
  },
});

export const vocabularyReducer = vocabularySlice.reducer;
