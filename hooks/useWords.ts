import { Word } from "@/model/entity/types";
import type { AppDispatch, RootState } from "@/store";
import {
  loadDailyWordSetThunk,
  loopWordInReviewThunk,
  markWordCompletelyLearnedThunk,
  markWordReviewedThunk,
  startLearnWordThunk,
} from "@/store/slice/wordsSlice";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useLoadDailySet() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const { wordsToReview, wordsToLearn, status, error } = useSelector(
    (s: RootState) => s.words
  );

  useEffect(() => {
    dispatch(loadDailyWordSetThunk({db}));
  }, [db, dispatch]);

  const reload = useCallback(() => {
    dispatch(loadDailyWordSetThunk({db}));
  }, [db, dispatch]);

  return { wordsToReview, wordsToLearn, status, error, reload };
}

export function useMarkWordReviewed() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const markWordReviewed = useCallback(
    (word: Word) => {
      if (db) dispatch(markWordReviewedThunk({ db, word }));
    },
    [db, dispatch]
  );
  return markWordReviewed;
}

export function useLoopWordInReview() {
  const dispatch = useDispatch<AppDispatch>();
  const loopWordInReview = useCallback(
    () => dispatch(loopWordInReviewThunk()),
    [dispatch]
  );
  return loopWordInReview;
}

export function useStartLearnWord() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const startLearn = useCallback(
    (word: Word) => {
      if (db) dispatch(startLearnWordThunk({ db, word }));
    },
    [db, dispatch]
  );
  return startLearn;
}

export function useLearnWordCompletely() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const completelyLearned = useCallback(
    (word: Word) => {
      if (db) dispatch(markWordCompletelyLearnedThunk({ db, word }));
    },
    [db, dispatch]
  );
  return completelyLearned;
}
