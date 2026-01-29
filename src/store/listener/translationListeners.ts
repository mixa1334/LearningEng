import { translationService } from "@/src/service/translationService";
import * as UserDataStorage from "@/src/storage/userDataStorageHelper";
import { USER_DATA_KEYS } from "@/src/storage/userDataStorageHelper";
import { clearTranslationsAction, initTranslationThunk, removeTranslationAction } from "../slice/translationSlice";
import { startAppListening } from "./appListener";

export default function initTranslationListeners() {
  startAppListening({
    actionCreator: removeTranslationAction,
    effect: async (action) => {
      const id = action.payload;
      await translationService.removeTranslation(id);
    },
  });

  startAppListening({
    actionCreator: clearTranslationsAction,
    effect: async () => {
      await translationService.clearTranslations();
    },
  });

  startAppListening({
    predicate: (_, curr, prev) => curr.translation.translatorEngine !== prev.translation.translatorEngine,
    effect: async (_, listenerApi) => {
      listenerApi.cancelActiveListeners();
      const translatorEngine = listenerApi.getState().translation.translatorEngine;
      translationService.setTranslatorEngine(translatorEngine);
      await UserDataStorage.setUserProp(USER_DATA_KEYS.TRANSLATOR_ENGINE, translatorEngine);
    },
  });

  startAppListening({
    predicate: (_, curr, prev) => curr.translation.deleteTranslationAfterAddingToVocabulary !== prev.translation.deleteTranslationAfterAddingToVocabulary,
    effect: async (_, listenerApi) => {
      const deleteTranslationAfterAddingToVocabulary = listenerApi.getState().translation.deleteTranslationAfterAddingToVocabulary;
      await UserDataStorage.setUserProp(USER_DATA_KEYS.DELETE_TRANSLATION_AFTER_ADDING_TO_VOCABULARY, deleteTranslationAfterAddingToVocabulary);
    },
  });

  startAppListening({
    predicate: (_, curr, prev) => curr.translation.clearTranslatorInputField !== prev.translation.clearTranslatorInputField,
    effect: async (_, listenerApi) => {
      const clearTranslatorInputField = listenerApi.getState().translation.clearTranslatorInputField;
      await UserDataStorage.setUserProp(USER_DATA_KEYS.CLEAR_TRANSLATOR_INPUT_FIELD, clearTranslatorInputField);
    },
  });

  startAppListening({
    actionCreator: initTranslationThunk.fulfilled,
    effect: async (action) => {
      const translatorEngine = action.payload.translatorEngine;
      translationService.setTranslatorEngine(translatorEngine);
    },
  });
};
