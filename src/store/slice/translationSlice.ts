import { Language, Translation, TranslatorEngine } from "@/src/entity/types";
import { translationService } from "@/src/service/translationService";
import * as UserDataStorage from "@/src/storage/userDataStorageHelper";
import { USER_DATA_KEYS } from "@/src/storage/userDataStorageHelper";
import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";
import { wrapThunk } from "../util/thunkUtils";
import { StateType } from "./stateType";

export type TranslationState = {
  latestTranslationId: number | undefined;
  translatorEngine: TranslatorEngine;
  deleteTranslationAfterAddingToVocabulary: boolean;
  clearTranslatorInputField: boolean;
  status?: StateType;
};

const translationAdapter = createEntityAdapter<Translation>({
  sortComparer: (a, b) => {
    const dateA = new Date(a.translation_date);
    const dateB = new Date(b.translation_date);
    return dateB.getTime() - dateA.getTime();
  },
});

const initialState = translationAdapter.getInitialState<TranslationState>({
  latestTranslationId: undefined,
  translatorEngine: TranslatorEngine.FREE_API,
  deleteTranslationAfterAddingToVocabulary: false,
  clearTranslatorInputField: false,
  status: StateType.idle,
});

export const translateWordThunk = createAsyncThunk<Translation, { word: string; language: Language }>(
  "translation/translateWord",
  async ({ word, language }, thunkAPI) => {
    return wrapThunk(
      () => translationService.translateWord(word, language),
      thunkAPI,
      "Unable to translate word"
    );
  }
);

export const initTranslationThunk = createAsyncThunk<{
  translations: Translation[],
  translatorEngine: TranslatorEngine,
  deleteTranslationAfterAddingToVocabulary: boolean,
  clearTranslatorInputField: boolean
}>("translation/initTranslation",
  async (_, thunkAPI) => {
    return await wrapThunk(
      async () => {
        const translations = await translationService.getAllTranslations();
        const userProps = await UserDataStorage.getMultipleUserProps([
          USER_DATA_KEYS.TRANSLATOR_ENGINE,
          USER_DATA_KEYS.DELETE_TRANSLATION_AFTER_ADDING_TO_VOCABULARY,
          USER_DATA_KEYS.CLEAR_TRANSLATOR_INPUT_FIELD,
        ]);
        return {
          translations,
          ...userProps,
        };
      },
      thunkAPI,
      "Unable to initialize translations"
    );
  }
);

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    removeTranslationAction: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      translationAdapter.removeOne(state, id);
      if (state.latestTranslationId === id) {
        state.latestTranslationId = undefined;
      }
    },
    clearTranslationsAction: (state) => {
      translationAdapter.removeAll(state);
      state.latestTranslationId = undefined;
    },
    setTranslatorEngineAction: (state, action: PayloadAction<TranslatorEngine>) => {
      state.translatorEngine = action.payload;
    },
    setDeleteTranslationAfterAddingToVocabularyAction: (state, action: PayloadAction<boolean>) => {
      state.deleteTranslationAfterAddingToVocabulary = action.payload;
    },
    setClearTranslatorInputFieldAction: (state, action: PayloadAction<boolean>) => {
      state.clearTranslatorInputField = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initTranslationThunk.pending, (state) => {
        state.status = StateType.loading;
      })
      .addCase(initTranslationThunk.rejected, (state, action) => {
        state.status = StateType.failed;
      })
      .addCase(initTranslationThunk.fulfilled, (state, action) => {
        translationAdapter.setAll(state, action.payload.translations);
        state.translatorEngine = action.payload.translatorEngine;
        state.deleteTranslationAfterAddingToVocabulary = action.payload.deleteTranslationAfterAddingToVocabulary;
        state.clearTranslatorInputField = action.payload.clearTranslatorInputField;
        state.latestTranslationId = undefined;
        state.status = StateType.succeeded;
      })
      .addCase(translateWordThunk.pending, (state) => {
        state.status = StateType.loading;
      })
      .addCase(translateWordThunk.rejected, (state, action) => {
        state.status = StateType.failed;
      })
      .addCase(translateWordThunk.fulfilled, (state, action) => {
        const translation = action.payload;
        state.latestTranslationId = translation.id;
        translationAdapter.addOne(state, translation);
        state.status = StateType.succeeded;
      });
  },
});

export const {
  removeTranslationAction,
  clearTranslationsAction,
  setTranslatorEngineAction,
  setDeleteTranslationAfterAddingToVocabularyAction,
  setClearTranslatorInputFieldAction,
} = translationSlice.actions;

export const {
  selectIds: selectTranslationIds,
  selectById: selectTranslationById,
} = translationAdapter.getSelectors((state: RootState) => state.translation);

export const translationReducer = translationSlice.reducer;
