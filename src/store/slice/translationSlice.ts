import { Language, Translation } from "@/src/entity/types";
import * as TranslationService from "@/src/service/translationService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StateType } from "./stateType";

export type TranslationState = {
  currentTranslation: Translation | undefined;
  translations: Translation[];
  status?: StateType;
  error?: string;
};

const initialState: TranslationState = {
  currentTranslation: undefined,
  translations: [],
  status: StateType.idle,
  error: undefined,
};

export const translateWordThunk = createAsyncThunk<Translation, { word: string; language: Language }>(
  "translation/translateWord",
  async ({ word, language }, thunkAPI) => {
    try {
      return await TranslationService.translateWord(word, language);
    } catch (error: any) {
      const msg = error?.message || "Unable to translate word";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const loadTranslationsThunk = createAsyncThunk<Translation[]>(
  "translation/loadTranslations",
  async () => await TranslationService.getTranslations()
);

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    removeTranslationAction: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.translations = state.translations.filter((t) => t.id !== id);
      if (state.currentTranslation?.id === id) {
        state.currentTranslation = undefined;
      }
      state.status = StateType.succeeded;
    },
    clearTranslationsAction: (state) => {
      state.translations = [];
      state.currentTranslation = undefined;
      state.status = StateType.succeeded;
    },
    resetErrorAction: (state) => {
      state.error = undefined;
      state.status = StateType.succeeded;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTranslationsThunk.pending, (state) => {
        state.status = StateType.loading;
        state.error = undefined;
      })
      .addCase(loadTranslationsThunk.rejected, (state, action) => {
        state.status = StateType.failed;
        state.error = action.error.message;
      })
      .addCase(loadTranslationsThunk.fulfilled, (state, action) => {
        state.translations = action.payload;
        state.status = StateType.succeeded;
      })
      .addCase(translateWordThunk.pending, (state) => {
        state.status = StateType.loading;
        state.error = undefined;
      })
      .addCase(translateWordThunk.rejected, (state, action) => {
        state.status = StateType.failed;
        state.error = action.payload as string;
      })
      .addCase(translateWordThunk.fulfilled, (state, action) => {
        const translation = action.payload;
        state.currentTranslation = translation;
        state.translations.unshift(translation);
        state.status = StateType.succeeded;
      });
  },
});

export const { removeTranslationAction, clearTranslationsAction, resetErrorAction } = translationSlice.actions;

export const translationReducer = translationSlice.reducer;
