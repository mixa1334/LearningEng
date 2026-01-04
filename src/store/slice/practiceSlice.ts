import { EntityType, type Category, type Word } from "@/src/entity/types";
import { getWordsByCriteria, WordCriteria } from "@/src/service/wordService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export type PracticeState = {
  category?: Category;
  onlyUserAddedWords: boolean;
  words: Word[];
};

const initialPracticeState: PracticeState = {
  category: undefined,
  onlyUserAddedWords: true,
  words: [],
};

const buildCategoryTypeCriteria = (practice: any) => {
  return new WordCriteria()
    .appendCategory(practice.category)
    .appendType(practice.onlyUserAddedWords ? EntityType.useradd : undefined);
};

export const resetPracticeSetThunk = createAsyncThunk<Word[]>(
  "practiceState/resetPracticeSet",
  async (_, { getState }) => {
    const practice = (getState() as RootState).practice;
    const criteria = buildCategoryTypeCriteria(practice);
    return await getWordsByCriteria(criteria);
  }
);

export const loadNextPracticeSetThunk = createAsyncThunk<Word[]>(
  "practiceState/loadNextPracticeStateSet",
  async (_, { getState }) => {
    const practice = (getState() as RootState).practice;
    const prevWords = practice.words;
    const offset =
      prevWords.length > 0 ? prevWords[prevWords.length - 1].id : 0;
    const criteria = buildCategoryTypeCriteria(practice).appendIdOffset(offset);
    return await getWordsByCriteria(criteria);
  }
);

const practiceSlice = createSlice({
  name: "practice",
  initialState: { ...initialPracticeState },
  reducers: {
    setNewCategory: (state, action: PayloadAction<Category>) => {
      state.category = action.payload;
    },
    setOnlyUserAdded: (state, action: PayloadAction<boolean>) => {
      state.onlyUserAddedWords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadNextPracticeSetThunk.fulfilled, (state, action) => {
      state.words = action.payload;
    });
    builder.addCase(resetPracticeSetThunk.fulfilled, (state, action) => {
      state.words = action.payload;
    });
  },
});

export const { setNewCategory, setOnlyUserAdded } = practiceSlice.actions;

export const practiceReducer = practiceSlice.reducer;
