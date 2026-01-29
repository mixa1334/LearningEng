import { NewCategoryDto } from "@/src/dto/NewCategoryDto";
import { NewWordDto } from "@/src/dto/NewWordDto";
import { Category, Word } from "@/src/entity/types";
import { useAppDispatch, useAppSelector } from "@/src/hooks/hooks";
import { WordCriteria } from "@/src/service/criteria/impl/WordCriteria";
import {
  addCategoryThunk,
  addWordThunk,
  editCategoryThunk,
  editWordThunk,
  removeCategoryThunk,
  removeWordThunk,
  updateWordCriteriaThunk
} from "@/src/store/slice/vocabularySlice";


export function useVocabulary() {
  const dispatch = useAppDispatch();
  const { userCategories, preloadedCategories, criteriaDto, words } = useAppSelector((s) => s.vocabulary);

  const updateWordCriteria = (criteria: WordCriteria) => dispatch(updateWordCriteriaThunk(criteria));

  const addWord = (newWord: NewWordDto) => dispatch(addWordThunk(newWord));

  const removeWord = (wordToDelete: Word) => dispatch(removeWordThunk(wordToDelete));

  const editWord = (wordToEdit: Word) => dispatch(editWordThunk(wordToEdit));

  const removeCategory = (categoryToDelete: Category) => dispatch(removeCategoryThunk(categoryToDelete));

  const addCategory = (newCategory: NewCategoryDto) => dispatch(addCategoryThunk(newCategory));

  const editCategory = (categoryToEdit: Category) => dispatch(editCategoryThunk(categoryToEdit));

  return {
    userCategories,
    preloadedCategories,
    criteriaDto,
    words,
    addWord,
    addCategory,
    removeWord,
    removeCategory,
    editWord,
    editCategory,
    updateWordCriteria,
  };
}
