import type { AppDispatch, RootState } from "@/store";
import { loadDueWords, markWordLearnedThunk } from "@/store/slice/wordsSlice";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useWordsDueToday() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((s: RootState) => s.words);

  useEffect(() => {
    dispatch(loadDueWords(db));
  }, [db, dispatch]);

  return { items, status, error, reload: () => dispatch(loadDueWords(db)) };
}

export function useMarkWordLearned() {
  const db = useSQLiteContext();
  const dispatch = useDispatch<AppDispatch>();
  return (id: number) => dispatch(markWordLearnedThunk({ db, id }));
}
