import { Language, TranslatorEngine } from "@/src/entity/types";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import {
  clearTranslationsAction,
  removeTranslationAction,
  selectTranslationById,
  selectTranslationIds,
  setClearTranslatorInputFieldAction,
  setDeleteTranslationAfterAddingToVocabularyAction,
  setTranslatorEngineAction,
  translateWordThunk
} from "@/src/store/slice/translationSlice";

export function useTranslationData() {

  const translationIds = useAppSelector(selectTranslationIds);
  const latestTranslationId = useAppSelector((s) => s.translation.latestTranslationId);
  const translatorEngine = useAppSelector((s) => s.translation.translatorEngine);
  const deleteTranslationAfterAddingToVocabulary = useAppSelector((s) => s.translation.deleteTranslationAfterAddingToVocabulary);
  const clearTranslatorInputField = useAppSelector((s) => s.translation.clearTranslatorInputField);
  const status = useAppSelector((s) => s.translation.status);

  return {
    translationIds,
    latestTranslationId,
    translatorEngine,
    deleteTranslationAfterAddingToVocabulary,
    clearTranslatorInputField,
    status,
  };
}

export function useTranslationActions() {
  const dispatch = useAppDispatch();

  const setTranslatorEngine = (translatorEngine: TranslatorEngine) => dispatch(setTranslatorEngineAction(translatorEngine));
  const setDeleteTranslationAfterAddingToVocabulary = (deleteTranslationAfterAddingToVocabulary: boolean) => dispatch(setDeleteTranslationAfterAddingToVocabularyAction(deleteTranslationAfterAddingToVocabulary));
  const setClearTranslatorInputField = (clearTranslatorInputField: boolean) => dispatch(setClearTranslatorInputFieldAction(clearTranslatorInputField));
  const removeTranslation = (id: number) => dispatch(removeTranslationAction(id));
  const translateWord = (word: string, language: Language) => dispatch(translateWordThunk({ word, language }));
  const clearTranslations = () => dispatch(clearTranslationsAction());

  return {
    setTranslatorEngine,
    setDeleteTranslationAfterAddingToVocabulary,
    setClearTranslatorInputField,
    removeTranslation,
    translateWord,
    clearTranslations,
  };
}

export function useTranslationItem(id: number) {
  return useAppSelector((state) => selectTranslationById(state, id));
}