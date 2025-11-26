import { NewCategoryDto } from "@/model/repository/categoryService";
import { NewWordDto } from "@/model/repository/wordService";
import { AppDispatch, useAppSelector } from "@/store";
import { addCategoryThunk } from "@/store/thunk/vocabulary/category/addCategoryThunk";
import { loadVocabularyThunk } from "@/store/thunk/vocabulary/loadVocabularyThunk";
import { addWordThunk } from "@/store/thunk/vocabulary/word/addWordThunk";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export function useVocabulary() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const { words, categories } = useAppSelector((s) => s.vocabulary);

  useEffect(() => {
    if (db) dispatch(loadVocabularyThunk(db));
  }, [db, dispatch]);

  const addWord = useCallback(
    (newWord: NewWordDto) => {
      if (db) dispatch(addWordThunk({ db, newWord }));
    },
    [db, dispatch]
  );

  const addCategory = useCallback(
    (newCategory: NewCategoryDto) => {
      if (db) dispatch(addCategoryThunk({ db, newCategory }));
    },
    [db, dispatch]
  );

  return { words, categories, addWord, addCategory };
}
