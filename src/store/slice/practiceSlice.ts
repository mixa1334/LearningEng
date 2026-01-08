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

const buildCriteria = (practice: PracticeState) => {
  const criteria = new WordCriteria().appendLimit(10).appendOrderBy("ASC").appendCategory(practice.category);
  if (practice.onlyUserAddedWords) {
    criteria.appendType(EntityType.useradd);
  }
  return criteria;
};

export const resetPracticeSetThunk = createAsyncThunk<Word[]>("practiceState/resetPracticeSet", async (_, { getState }) => {
  const practice = (getState() as RootState).practice;
  const criteria = buildCriteria(practice);
  return await getWordsByCriteria(criteria);
});

export const loadNextPracticeSetThunk = createAsyncThunk<Word[]>(
  "practiceState/loadNextPracticeStateSet",
  async (_, { getState }) => {
    const practice = (getState() as RootState).practice;
    const prevWords = practice.words;
    const offset = prevWords.length > 0 ? prevWords[prevWords.length - 1].id : 0;
    const criteria = buildCriteria(practice).appendIdOffset(offset);
    return await getWordsByCriteria(criteria);
  }
);

export const reloadPracticeThunk = createAsyncThunk<PracticeState>("practiceState/reloadPracticeThunk", async () => {
  const practiceState = {
    onlyUserAddedWords: true,
    words: [],
    category: undefined,
  };
  const criteria = buildCriteria(practiceState);
  const words = await getWordsByCriteria(criteria);
  return {
    ...practiceState,
    words,
  };
});

const practiceSlice = createSlice({
  name: "practice",
  initialState: { ...initialPracticeState },
  reducers: {
    setNewCategory: (state, action: PayloadAction<Category | undefined>) => {
      state.category = action.payload;
    },
    setOnlyUserAdded: (state, action: PayloadAction<boolean>) => {
      state.onlyUserAddedWords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNextPracticeSetThunk.fulfilled, (state, action) => {
        state.words = action.payload;
      })
      .addCase(resetPracticeSetThunk.fulfilled, (state, action) => {
        state.words = action.payload;
      })
      .addCase(reloadPracticeThunk.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export const { setNewCategory, setOnlyUserAdded } = practiceSlice.actions;

export const practiceReducer = practiceSlice.reducer;
