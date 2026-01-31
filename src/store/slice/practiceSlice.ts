import { EntityType, type Category, type Word } from "@/src/entity/types";
import { WordCriteria } from "@/src/service/criteria/impl/WordCriteria";
import { Pageable } from "@/src/service/criteria/Pageable";
import { getWordsByPageable } from "@/src/service/wordService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";

export const DEFAULT_PRACTICE_LIMIT = 10;

export type PracticeState = {
  category?: Category;
  wordType?: EntityType;
  newFirstly: boolean;
  practiceLimit: number;
  words: Word[];
};

const initialPracticeState: PracticeState = {
  category: undefined,
  wordType: EntityType.useradd,
  newFirstly: true,
  practiceLimit: DEFAULT_PRACTICE_LIMIT,
  words: [],
};

const buildPageable = (practice: PracticeState) => {
  const pageable = new Pageable(practice.practiceLimit);
  pageable.setDirection(practice.newFirstly ? "desc" : "asc");
  pageable.setTableAlias("w");
  const criteria = new WordCriteria();
  criteria.appendCategory(practice.category);
  criteria.appendType(practice.wordType);
  return { pageable, criteria };
};

export const resetPracticeSetThunk = createAsyncThunk<Word[]>("practiceState/resetPracticeSet", async (_, { getState }) => {
  const practice = (getState() as RootState).practice;
  const { pageable, criteria } = buildPageable(practice);
  return await getWordsByPageable(pageable, criteria);
});

export const loadNextPracticeSetThunk = createAsyncThunk<Word[]>(
  "practiceState/loadNextPracticeStateSet",
  async (_, { getState }) => {
    const practice = (getState() as RootState).practice;
    const prevWords = practice.words;
    const { pageable, criteria } = buildPageable(practice);
    if (prevWords.length > 0) {
      const lastId = prevWords[prevWords.length - 1].id;
      console.log("lastId", lastId);
      console.log("prevWords", prevWords);
      pageable.setLastId(lastId);
    }
    return await getWordsByPageable(pageable, criteria);
  }
);

export const reloadPracticeThunk = createAsyncThunk<PracticeState>("practiceState/reloadPracticeThunk", async () => {
  const practiceState = { ...initialPracticeState };
  const { pageable, criteria } = buildPageable(practiceState);
  practiceState.words = await getWordsByPageable(pageable, criteria);
  return practiceState;
});

const practiceSlice = createSlice({
  name: "practice",
  initialState: { ...initialPracticeState },
  reducers: {
    setNewCategoryAction: (state, action: PayloadAction<Category | undefined>) => {
      state.category = action.payload;
    },
    setWordTypeAction: (state, action: PayloadAction<EntityType | undefined>) => {
      state.wordType = action.payload;
    },
    setNewFirstlyAction: (state, action: PayloadAction<boolean>) => {
      state.newFirstly = action.payload;
    },
    setPracticeLimitAction: (state, action: PayloadAction<number>) => {
      state.practiceLimit = action.payload;
    },
    resetCriteriaAction: (state) => {
      state.category = undefined;
      state.wordType = EntityType.useradd;
      state.practiceLimit = DEFAULT_PRACTICE_LIMIT;
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

export const {
  setNewCategoryAction,
  setWordTypeAction,
  setPracticeLimitAction,
  resetCriteriaAction,
  setNewFirstlyAction,
} = practiceSlice.actions;

export const practiceReducer = practiceSlice.reducer;
