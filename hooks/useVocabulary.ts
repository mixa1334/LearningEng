import { NewCategoryDto } from "@/model/dto/NewCategoryDto";
import { NewWordDto } from "@/model/dto/NewWordDto";
import { Category, Word } from "@/model/entity/types";
import { AppDispatch, useAppSelector } from "@/store";
import { addCategoryThunk } from "@/store/thunk/vocabulary/category/addCategoryThunk";
import { editCategoryThunk } from "@/store/thunk/vocabulary/category/editCategoryThunk";
import { removeCategoryThunk } from "@/store/thunk/vocabulary/category/removeCategoryThunk";
import { loadVocabularyThunk } from "@/store/thunk/vocabulary/loadVocabularyThunk";
import { addWordThunk } from "@/store/thunk/vocabulary/word/addWordThunk";
import { editWordThunk } from "@/store/thunk/vocabulary/word/editWordThunk";
import { removeWordThunk } from "@/store/thunk/vocabulary/word/removeWordThunk";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export function useVocabulary() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const { words, categories, preloadedWords } = useAppSelector((s) => s.vocabulary);

  useEffect(() => {
    if (db) dispatch(loadVocabularyThunk(db));
  }, [db, dispatch]);

  const addWord = useCallback(
    (newWord: NewWordDto) => {
      if (db) dispatch(addWordThunk({ db, newWord }));
    },
    [db, dispatch]
  );

  const removeWord = useCallback(
    (wordToDelete: Word) => {
      if (db) dispatch(removeWordThunk({ db, wordToDelete }));
    },
    [db, dispatch]
  );

  const editWord = useCallback(
    (wordToEdit: Word) => {
      if (db) dispatch(editWordThunk({ db, wordToEdit }));
    },
    [db, dispatch]
  );

  const removeCategory = useCallback(
    (categoryToDelete: Category) => {
      if (db) dispatch(removeCategoryThunk({ db, categoryToDelete }));
    },
    [db, dispatch]
  );

  const addCategory = useCallback(
    (newCategory: NewCategoryDto) => {
      if (db) dispatch(addCategoryThunk({ db, newCategory }));
    },
    [db, dispatch]
  );

  const editCategory = useCallback(
    (categoryToEdit: Category) => {
      if (db) dispatch(editCategoryThunk({ db, categoryToEdit }));
    },
    [db, dispatch]
  );

  return {
    words,
    categories,
    preloadedWords,
    addWord,
    addCategory,
    removeWord,
    removeCategory,
    editWord,
    editCategory,
  };
}
