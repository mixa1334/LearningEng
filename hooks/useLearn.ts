import { Word } from "@/model/entity/types";
import { useAppSelector, type AppDispatch } from "@/store";
import { loadDailyWordSetThunk } from "@/store/thunk/learn/loadDailyWordSetThunk";
import { markWordCompletelyLearnedThunk } from "@/store/thunk/learn/markWordCompletelyLearnedThunk";
import { markWordNotReviewedThunk } from "@/store/thunk/learn/markWordNotReviewedThunk";
import { markWordReviewedThunk } from "@/store/thunk/learn/markWordReviewedThunk";
import { startLearnWordThunk } from "@/store/thunk/learn/startLearnWordThunk";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export function useLearningDailySet() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const { wordsToReview, wordsToLearn, status, error } = useAppSelector(
    (s) => s.learn
  );

  useEffect(() => {
    if (db) dispatch(loadDailyWordSetThunk({ db }));
  }, [db, dispatch]);

  const reloadDailySet = useCallback(() => {
    if (db) dispatch(loadDailyWordSetThunk({ db }));
  }, [db, dispatch]);

  return { wordsToReview, wordsToLearn, status, error, reloadDailySet };
}

export function useLearnUtil() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const markWordReviewed = useCallback(
    (word: Word) => {
      if (db) dispatch(markWordReviewedThunk({ db, word }));
    },
    [db, dispatch]
  );

  const markWordNotReviewed = useCallback(
    () => dispatch(markWordNotReviewedThunk()),
    [dispatch]
  );

  const startLearnNewWord = useCallback(
    (word: Word) => {
      if (db) dispatch(startLearnWordThunk({ db, word }));
    },
    [db, dispatch]
  );

  const markWordCompletelyLearned = useCallback(
    (word: Word) => {
      if (db) dispatch(markWordCompletelyLearnedThunk({ db, word }));
    },
    [db, dispatch]
  );
  return {
    markWordReviewed,
    markWordNotReviewed,
    startLearnNewWord,
    markWordCompletelyLearned,
  };
}
