import { NewCategoryDto } from "@/src/dto/NewCategoryDto";
import { NewWordDto } from "@/src/dto/NewWordDto";
import { Category, Word } from "@/src/entity/types";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
    addCategoryThunk,
    addWordThunk,
    editCategoryThunk,
    editWordThunk,
    removeCategoryThunk,
    removeWordThunk
} from "@/src/store/slice/vocabularySlice";


export function useVocabulary() {
  const dispatch = useAppDispatch();
  const { userWords, preloadedWords, userCategories, allCategories } = useAppSelector((s) => s.vocabulary);

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
