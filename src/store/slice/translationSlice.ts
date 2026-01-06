import { Language, Translation } from "@/src/entity/types";
import { clearTranslations, getTranslations, removeTranslation, translateAndSaveWord } from "@/src/service/translationService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { StateType } from "./stateType";

export type TranslationState = {
  currentTranslation: Translation | undefined;
  translations: Translation[];
  status?: StateType;
};

const initialTranslationState: TranslationState = {
  currentTranslation: undefined,
  translations: [],
  status: StateType.idle,
};

export const translateWordThunk = createAsyncThunk<TranslationState, { word: string; language: Language }>(
  "translation/translateWord",
  async ({ word, language }, { getState }) => {
    const currentTranslation = await translateAndSaveWord(word, language);
    const currentState = (getState() as RootState).translation;
    const translations = [currentTranslation, ...currentState.translations];
    return { currentTranslation, translations };
  }
);

export const loadTranslationsThunk = createAsyncThunk<Translation[]>("translation/loadTranslations", async () => {
  const translations = await getTranslations();
  return translations;
});

export const removeTranslationThunk = createAsyncThunk<TranslationState, number>(
  "translation/removeTranslation",
  async (translationId, { getState }) => {
    await removeTranslation(translationId);
    const currentState = (getState() as RootState).translation;
    const currentTranslation = currentState.currentTranslation?.id === translationId ? undefined : currentState.currentTranslation;
    const translations = currentState.translations.filter((t) => t.id !== translationId);
    return { currentTranslation, translations };
  }
);

export const clearTranslationsThunk = createAsyncThunk<TranslationState>("translation/clearTranslations", async () => {
  await clearTranslations();
  return { ...initialTranslationState };
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
      state.currentTranslation = action.payload.currentTranslation;
      state.translations = action.payload.translations;
      state.status = StateType.succeeded;
    });
    builder.addCase(loadTranslationsThunk.fulfilled, (state, action) => {
      state.translations = action.payload;
    });
    builder.addCase(removeTranslationThunk.fulfilled, (state, action) => {
      state.status = StateType.succeeded;
      state.currentTranslation = action.payload.currentTranslation;
      state.translations = action.payload.translations;
    });
    builder.addCase(clearTranslationsThunk.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const translationReducer = translationSlice.reducer;
