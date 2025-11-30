import { AppDispatch, useAppSelector } from "@/store";
import { resetWordLearningProgressThunk } from "@/store/thunk/learn/resetLearningStatsThunk";
import { changeDailyGoalThunk } from "@/store/thunk/userStats/changeDailyGoalThunk";
import { changeNameThunk } from "@/store/thunk/userStats/changeNameThunk";
import { resetUserStatsThunk } from "@/store/thunk/userStats/resetUserStatsThunk";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useStatistics() {
  const dispatch = useDispatch<AppDispatch>();
  const db = useSQLiteContext();
  const name = useAppSelector((s) => s.stats.name);
  const streak = useAppSelector((s) => s.stats.streak);
  const lastLearningDate = useAppSelector((s) => s.stats.lastLearningDate);
  const reviewedToday = useAppSelector((s) => s.stats.reviewedToday);
  const dailyGoal = useAppSelector((s) => s.stats.dailyGoal);

  // todo refactor
  const changeGoal = useCallback(
    (goal: number) => {
      if (db) dispatch(changeDailyGoalThunk({ newDailyGoal: goal, db }));
    },
    [dispatch, db]
  );

  const changeName = (name: string) => dispatch(changeNameThunk(name));
  const resetUserStats = () => dispatch(resetUserStatsThunk());
  const resetWordsProgress = useCallback(() => {
    if (db) dispatch(resetWordLearningProgressThunk(db));
  }, [db, dispatch]);

  return {
    name,
    streak,
    lastLearningDate,
    reviewedToday,
    dailyGoal,
    changeGoal,
    changeName,
    resetUserStats,
    resetWordsProgress,
  };
}
