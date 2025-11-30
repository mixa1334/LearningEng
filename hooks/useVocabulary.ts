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
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export function useVocabulary() {
  const dispatch = useDispatch<AppDispatch>();
  const { userWords, categories, preloadedWords } = useAppSelector(
    (s) => s.vocabulary
  );

  useEffect(() => {
    dispatch(loadVocabularyThunk());
  }, [dispatch]);

  const addWord = useCallback(
    (newWord: NewWordDto) => {
      dispatch(addWordThunk({ newWord }));
    },
    [dispatch]
  );

  const removeWord = useCallback(
    (wordToDelete: Word) => {
      dispatch(removeWordThunk({ wordToDelete }));
    },
    [dispatch]
  );

  const editWord = useCallback(
    (wordToEdit: Word) => {
      dispatch(editWordThunk({ wordToEdit }));
    },
    [dispatch]
  );

  const removeCategory = useCallback(
    (categoryToDelete: Category) => {
      dispatch(removeCategoryThunk({ categoryToDelete }));
    },
    [dispatch]
  );

  const addCategory = useCallback(
    (newCategory: NewCategoryDto) => {
      dispatch(addCategoryThunk({ newCategory }));
    },
    [dispatch]
  );

  const editCategory = useCallback(
    (categoryToEdit: Category) => {
      dispatch(editCategoryThunk({ categoryToEdit }));
    },
    [dispatch]
  );

  return {
    userWords,
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
