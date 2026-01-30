import { NewCategoryDto } from "@/src/dto/NewCategoryDto";
import { NewWordDto } from "@/src/dto/NewWordDto";
import { Category, EntityType, Word } from "@/src/entity/types";
import {
  addNewCategory,
  deleteAllUserCategories,
  deleteUserCategory,
  editUserCategory,
  getCategoriesByType,
} from "@/src/service/categoryService";
import { WordCriteria, WordCriteriaDTO } from "@/src/service/criteria/impl/WordCriteria";
import {
  addNewWord,
  deleteAllUserWords,
  deleteUserWord,
  editUserWord,
  getWordsByCriteria,
} from "@/src/service/wordService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../types";
import { loadDailyWordSetThunk } from "./learnSlice";
import { reloadPracticeThunk, resetPracticeSetThunk } from "./practiceSlice";

const getDefaultCriteria = () => new WordCriteria().appendType(EntityType.useradd).toRedux();

export type VocabularyState = {
  userCategories: Category[];
  preloadedCategories: Category[];
  criteriaDto: WordCriteriaDTO;
  words: Word[];
};

const initialVocabularyState: VocabularyState = {
  userCategories: [],
  preloadedCategories: [],
  criteriaDto: getDefaultCriteria(),
  words: [],
};

export const addCategoryThunk = createAsyncThunk<void, NewCategoryDto>(
  "vocabulary/addCategoryThunk",
  async (newCategory, { dispatch }) => {
    await addNewCategory(newCategory);
    dispatch(reloadUserCategoriesThunk());
  }
);

export const editCategoryThunk = createAsyncThunk<void, Category>(
  "vocabulary/editCategoryThunk",
  async (categoryToEdit, { dispatch }) => {
    await editUserCategory(categoryToEdit);
    dispatch(reloadUserCategoriesThunk());
  }
);

export const removeCategoryThunk = createAsyncThunk<void, Category>(
  "vocabulary/removeCategoryThunk",
  async (categoryToDelete, { dispatch }) => {
    await deleteUserCategory(categoryToDelete);
    dispatch(reloadUserCategoriesThunk());
  }
);

const reloadUserCategoriesThunk = createAsyncThunk<Category[]>("vocabulary/reloadUserCategoriesThunk", async () => {
  return await getCategoriesByType(EntityType.useradd);
});

export const addWordThunk = createAsyncThunk<void, NewWordDto>("vocabulary/addWordThunk", async (newWord, { dispatch }) => {
  await addNewWord(newWord);
  dispatch(loadDailyWordSetThunk());
  dispatch(resetPracticeSetThunk());
  dispatch(reloadWordsThunk());
});

export const editWordThunk = createAsyncThunk<void, Word>("vocabulary/editWordThunk", async (wordToEdit, { dispatch }) => {
  await editUserWord(wordToEdit);
  dispatch(loadDailyWordSetThunk());
  dispatch(resetPracticeSetThunk());
  dispatch(reloadWordsThunk());
});

export const removeWordThunk = createAsyncThunk<void, Word>("vocabulary/removeWordThunk", async (wordToDelete, { dispatch }) => {
  await deleteUserWord(wordToDelete);
  dispatch(loadDailyWordSetThunk());
  dispatch(resetPracticeSetThunk());
  dispatch(reloadWordsThunk());
});

export const updateWordCriteriaThunk = createAsyncThunk<{ criteriaDto: WordCriteriaDTO; words: Word[] }, WordCriteria>(
  "vocabulary/updateWordCriteriaThunk",
  async (criteria) => {
    return {
      criteriaDto: criteria.toRedux(),
      words: await getWordsByCriteria(criteria),
    };
  }
);

const reloadWordsThunk = createAsyncThunk<Word[]>("vocabulary/reloadWordsThunk", async (_, { getState }) => {
  return await getWordsByCriteria(WordCriteria.fromRedux((getState() as RootState).vocabulary.criteriaDto));
});

export const initalizeVocabularyThunk = createAsyncThunk<VocabularyState>("vocabulary/initalizeVocabularyThunk", async () => {
  const userCategories = await getCategoriesByType(EntityType.useradd);
  const preloadedCategories = await getCategoriesByType(EntityType.preloaded);
  //add pagination withh limits!
  const criteria = WordCriteria.fromRedux(initialVocabularyState.criteriaDto);
  const words = await getWordsByCriteria(criteria);
  return {
    userCategories,
    preloadedCategories,
    criteriaDto: criteria.toRedux(),
    words,
  };
});

export const removeUserVocabularyThunk = createAsyncThunk<void>(
  "vocabulary/removeUserVocabularyThunk",
  async (_, { dispatch }) => {
    const wordsDeleted = await deleteAllUserWords();
    const categoriesDeleted = await deleteAllUserCategories();
    if (categoriesDeleted) {
      await dispatch(reloadUserCategoriesThunk());
    }
    if (wordsDeleted) {
      dispatch(reloadWordsThunk());
      dispatch(loadDailyWordSetThunk());
      dispatch(reloadPracticeThunk());
    }
  }
);

const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState: { ...initialVocabularyState },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(initalizeVocabularyThunk.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(reloadUserCategoriesThunk.fulfilled, (state, action) => {
        state.userCategories = action.payload;
      })
      .addCase(updateWordCriteriaThunk.fulfilled, (state, action) => {
        state.criteriaDto = action.payload.criteriaDto;
        state.words = action.payload.words;
      })
      .addCase(reloadWordsThunk.fulfilled, (state, action) => {
        state.words = action.payload;
      })
      .addCase(removeUserVocabularyThunk.fulfilled, (state, action) => {
        state.criteriaDto = getDefaultCriteria();
      }),
});

export const vocabularyReducer = vocabularySlice.reducer;
