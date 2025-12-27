import { Language, Translation } from "@/src/model/entity/types";
import { clearTranslations, getTranslations, removeTranslation, translateAndSaveWord } from "@/src/model/service/translationService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { StateType } from "./stateType";

export type TranslationState = {
  currentTranslation: Translation | undefined;
  translations: Translation[];
  status: StateType;
};

const initialTranslationState: TranslationState = {
  currentTranslation: undefined,
  translations: [],
  status: StateType.idle,
};

export const translateWordThunk = createAsyncThunk<Translation, { word: string; language: Language }>(
  "translation/translateWord",
  async ({ word, language }, { dispatch }) => {
    const translation = await translateAndSaveWord(word, language);
    dispatch(loadTranslationsThunk());
    return translation;
  }
);

export const loadTranslationsThunk = createAsyncThunk<Translation[]>("translation/loadTranslations", async () => {
  const translations = await getTranslations();
  return translations;
});

export const removeTranslationThunk = createAsyncThunk<Translation[], Translation>(
  "translation/removeTranslation",
  async (translation, { getState }) => {
    await removeTranslation(translation);
    const translations = (getState() as RootState).translation.translations.filter((t) => t.id !== translation.id);
    return translations;
  }
);

export const clearTranslationsThunk = createAsyncThunk<TranslationState>("translation/clearTranslations", async () => {
  await clearTranslations();
  return initialTranslationState;
});

const translationSlice = createSlice({
  name: "translation",
  initialState: { ...initialTranslationState },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(translateWordThunk.pending, (state) => {
      state.status = StateType.loading;
    });
    builder.addCase(translateWordThunk.fulfilled, (state, action) => {
      state.currentTranslation = action.payload;
      state.status = StateType.succeeded;
    });
    builder.addCase(loadTranslationsThunk.fulfilled, (state, action) => {
      state.translations = action.payload;
    });
    builder.addCase(removeTranslationThunk.fulfilled, (state, action) => {
      state.status = StateType.succeeded;
      state.translations = action.payload;
    });
    builder.addCase(clearTranslationsThunk.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const translationReducer = translationSlice.reducer;
