import { Word } from "@/src/entity/types";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
    loadDailyWordSetThunk,
    markWordCompletelyLearnedThunk,
    markWordNotReviewedThunk,
    markWordReviewedThunk,
    startLearnWordThunk,
} from "@/src/store/slice/learnSlice";

export function useLearningDailySet() {
  const dispatch = useAppDispatch();
  const { wordsToReview, wordsToLearn, error } = useAppSelector((s) => s.learn);

  const reloadDailySet = () => dispatch(loadDailyWordSetThunk());

  return { wordsToReview, wordsToLearn, error, reloadDailySet };
}

export function useLearnUtil() {
  const dispatch = useAppDispatch();

  const markWordReviewed = (word: Word) => dispatch(markWordReviewedThunk(word));
  const markWordNotReviewed = () => dispatch(markWordNotReviewedThunk());
  const startLearnNewWord = (word: Word) => dispatch(startLearnWordThunk(word));
  const markWordCompletelyLearned = (word: Word) => dispatch(markWordCompletelyLearnedThunk(word));

  return {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  };
}
