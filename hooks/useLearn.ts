import { Word } from "@/model/entity/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadDailyWordSetThunk,
  markWordCompletelyLearnedThunk,
  markWordNotReviewedThunk,
  markWordReviewedThunk,
  startLearnWordThunk,
} from "@/store/slice/learnSlice";

import { useEffect } from "react";

export function useLearningDailySet() {
  const dispatch = useAppDispatch();
  const { wordsToReview, wordsToLearn, error } = useAppSelector((s) => s.learn);

  useEffect(() => {
    dispatch(loadDailyWordSetThunk());
  }, [dispatch]);

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
