import { Category, EntityType } from "../entity/types";
import { useAppDispatch, useAppSelector } from "../store";
import {
  loadNextPracticeSetThunk,
  resetCriteriaAction,
  resetPracticeSetThunk,
  setNewCategoryAction,
  setPracticeLimitAction,
  setWordTypeAction,
} from "../store/slice/practiceSlice";

export function usePractice() {
  const dispatch = useAppDispatch();
  const { category, wordType, practiceLimit, words } = useAppSelector((s) => s.practice);

  const setCategory = (category?: Category) => dispatch(setNewCategoryAction(category));
  const setWordType = (wordType?: EntityType) => {
    dispatch(setWordTypeAction(wordType));
  };
  const setPracticeLimit = (practiceLimit: number) => {
    dispatch(setPracticeLimitAction(practiceLimit));
  };

  const resetCriteria = () => dispatch(resetCriteriaAction());
  const loadNextPracticeSet = () => dispatch(loadNextPracticeSetThunk());

  const resetPracticeSet = () => dispatch(resetPracticeSetThunk());

  return {
    category,
    wordType,
    practiceLimit,
    words,
    setCategory,
    setWordType,
    setPracticeLimit,
    loadNextPracticeSet,
    resetPracticeSet,
    resetCriteria,
  };
}
