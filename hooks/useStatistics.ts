import { AppDispatch, useAppSelector } from "@/store";
import { resetWordLearningProgressThunk } from "@/store/thunk/learn/resetLearningStatsThunk";
import { changeDailyGoalThunk } from "@/store/thunk/statistics/changeDailyGoalThunk";
import { changeNameThunk } from "@/store/thunk/statistics/changeNameThunk";
import { resetUserStatsThunk } from "@/store/thunk/statistics/resetUserStatsThunk";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useStatistics() {
  const dispatch = useDispatch<AppDispatch>();
  const name = useAppSelector((s) => s.statistics.name);
  const streak = useAppSelector((s) => s.statistics.streak);
  const lastLearningDate = useAppSelector((s) => s.statistics.lastLearningDate);
  const reviewedToday = useAppSelector((s) => s.statistics.reviewedToday);
  const dailyGoal = useAppSelector((s) => s.statistics.dailyGoal);

  // todo refactor
  const changeGoal = useCallback(
    (goal: number) => {
      dispatch(changeDailyGoalThunk({ newDailyGoal: goal }));
    },
    [dispatch]
  );

  const changeName = (name: string) => dispatch(changeNameThunk(name));
  const resetUserStats = () => dispatch(resetUserStatsThunk());
  const resetWordsProgress = useCallback(() => {
    dispatch(resetWordLearningProgressThunk());
  }, [dispatch]);

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
