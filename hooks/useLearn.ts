import { Word } from "@/model/entity/types";
import { useAppSelector, type AppDispatch } from "@/store";
import { loadDailyWordSetThunk } from "@/store/thunk/learn/loadDailyWordSetThunk";
import { markWordCompletelyLearnedThunk } from "@/store/thunk/learn/markWordCompletelyLearnedThunk";
import { markWordNotReviewedThunk } from "@/store/thunk/learn/markWordNotReviewedThunk";
import { markWordReviewedThunk } from "@/store/thunk/learn/markWordReviewedThunk";
import { startLearnWordThunk } from "@/store/thunk/learn/startLearnWordThunk";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export function useLearningDailySet() {
  const dispatch = useDispatch<AppDispatch>();
  const { wordsToReview, wordsToLearn, status, error } = useAppSelector(
    (s) => s.learn
  );

  useEffect(() => {
    dispatch(loadDailyWordSetThunk());
  }, [dispatch]);

  const reloadDailySet = useCallback(() => {
    dispatch(loadDailyWordSetThunk());
  }, [dispatch]);

  return { wordsToReview, wordsToLearn, status, error, reloadDailySet };
}

export function useLearnUtil() {
  const dispatch = useDispatch<AppDispatch>();
  const markWordReviewed = useCallback(
    (word: Word) => {
      dispatch(markWordReviewedThunk({ word }));
    },
    [dispatch]
  );

  const markWordNotReviewed = useCallback(
    () => dispatch(markWordNotReviewedThunk()),
    [dispatch]
  );

  const startLearnNewWord = useCallback(
    (word: Word) => {
      dispatch(startLearnWordThunk({ word }));
    },
    [dispatch]
  );

  const markWordCompletelyLearned = useCallback(
    (word: Word) => {
      dispatch(markWordCompletelyLearnedThunk({ word }));
    },
    [dispatch]
  );
  return {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  };
}
