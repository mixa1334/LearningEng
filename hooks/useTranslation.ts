import { Language, Translation } from "@/model/entity/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearTranslationsThunk, loadTranslationsThunk, removeTranslationThunk, translateWordThunk } from "@/store/slice/translationSlice";

export function useTranslation() {
  const dispatch = useAppDispatch();
  const { currentTranslation, translations, status } = useAppSelector((s) => s.translation);

  const loadTranslations = () => dispatch(loadTranslationsThunk());
  const removeTranslation = (translation: Translation) => dispatch(removeTranslationThunk(translation));
  const translateWord = (word: string, language: Language) => dispatch(translateWordThunk({ word, language }));
  const clearTranslations = () => dispatch(clearTranslationsThunk());

  return { currentTranslation, translations, status, loadTranslations, removeTranslation, translateWord, clearTranslations };
}
