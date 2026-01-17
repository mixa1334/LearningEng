import { Language } from "@/src/entity/types";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
  clearTranslationsAction,
  loadTranslationsThunk,
  removeTranslationAction,
  resetErrorAction,
  translateWordThunk,
} from "@/src/store/slice/translationSlice";

export function useTranslation() {
  const dispatch = useAppDispatch();
  const { currentTranslation, translations, status, error } = useAppSelector((s) => s.translation);

  const resetError = () => dispatch(resetErrorAction());
  const loadTranslations = () => dispatch(loadTranslationsThunk());
  const removeTranslation = (translationId: number) => dispatch(removeTranslationAction(translationId));
  const translateWord = (word: string, language: Language) => dispatch(translateWordThunk({ word, language }));
  const clearTranslations = () => dispatch(clearTranslationsAction());

  return {
    currentTranslation,
    translations,
    status,
    error,
    resetError,
    loadTranslations,
    removeTranslation,
    translateWord,
    clearTranslations,
  };
}
