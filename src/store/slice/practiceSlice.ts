import { EntityType, type Category, type Word } from "@/src/entity/types";
import { WordCriteria } from "@/src/service/criteria/impl/WordCriteria";
import { getWordsByCriteria } from "@/src/service/wordService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";

//cuz depends on ids (which are in asc order) we need to load words in asc order
const ORDER_BY = "ASC";

export const DEFAULT_PRACTICE_LIMIT = 10;

export type PracticeState = {
  category?: Category;
  wordType?: EntityType;
  practiceLimit: number;
  words: Word[];
};

const initialPracticeState: PracticeState = {
  category: undefined,
  wordType: EntityType.useradd,
  practiceLimit: DEFAULT_PRACTICE_LIMIT,
  words: [],
};

const buildCriteria = (practice: PracticeState) => {
  return new WordCriteria()
    // .appendLimit(practice.practiceLimit)
    // .appendOrderBy(ORDER_BY)
    .appendCategory(practice.category)
    .appendType(practice.wordType);
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
    const criteria = buildCriteria(practice)
                    //  .appendIdOffset(offset);
    return await getWordsByCriteria(criteria);
  }
);

export const reloadPracticeThunk = createAsyncThunk<PracticeState>("practiceState/reloadPracticeThunk", async () => {
  const practiceState = { ...initialPracticeState };
  const criteria = buildCriteria(practiceState);
  practiceState.words = await getWordsByCriteria(criteria);
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

export const { setNewCategoryAction, setWordTypeAction, setPracticeLimitAction, resetCriteriaAction } = practiceSlice.actions;

export const practiceReducer = practiceSlice.reducer;
