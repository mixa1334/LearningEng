import { Category } from "../entity/types";
import { useAppDispatch, useAppSelector } from "../store";
import {
  loadNextPracticeSetThunk,
  resetPracticeSetThunk,
  setNewCategory,
  setOnlyUserAdded,
} from "../store/slice/practiceSlice";

export function usePractice() {
  const dispatch = useAppDispatch();
  const { category, onlyUserAddedWords, words } = useAppSelector(
    (s) => s.practice
  );

  const setCategory = (category?: Category) =>
    dispatch(setNewCategory(category));
  const setOnlyUserWords = (onlyUserAddedWords: boolean) => {
    dispatch(setOnlyUserAdded(onlyUserAddedWords));
  };

  const loadNextSet = () => dispatch(loadNextPracticeSetThunk());

  const resetSet = () => dispatch(resetPracticeSetThunk());

  return {
    category,
    onlyUserAddedWords,
    words,
    setCategory,
    setOnlyUserWords,
    loadNextSet,
    resetSet,
  };
}
