import { NewCategoryDto } from "@/model/dto/NewCategoryDto";
import { NewWordDto } from "@/model/dto/NewWordDto";
import { Category, Word } from "@/model/entity/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addCategoryThunk,
  addWordThunk,
  editCategoryThunk,
  editWordThunk,
  loadVocabularyThunk,
  removeCategoryThunk,
  removeWordThunk,
} from "@/store/slice/vocabularySlice";

import { useEffect } from "react";

export function useVocabulary() {
  const dispatch = useAppDispatch();
  const { userWords, preloadedWords, userCategories, allCategories } = useAppSelector((s) => s.vocabulary);

  useEffect(() => {
    dispatch(loadVocabularyThunk());
  }, [dispatch]);

  const addWord = (newWord: NewWordDto) => dispatch(addWordThunk(newWord));

  const removeWord = (wordToDelete: Word) => dispatch(removeWordThunk(wordToDelete));

  const editWord = (wordToEdit: Word) => dispatch(editWordThunk(wordToEdit));

  const removeCategory = (categoryToDelete: Category) => dispatch(removeCategoryThunk(categoryToDelete));

  const addCategory = (newCategory: NewCategoryDto) => dispatch(addCategoryThunk(newCategory));

  const editCategory = (categoryToEdit: Category) => dispatch(editCategoryThunk(categoryToEdit));

  return {
    userWords,
    preloadedWords,
    userCategories,
    allCategories,
    addWord,
    addCategory,
    removeWord,
    removeCategory,
    editWord,
    editCategory,
  };
}
