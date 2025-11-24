import { AppDispatch, useAppSelector } from "@/store";
import { loadDailyWordSetThunk } from "@/store/slice/wordsSlice";
import { changeDailyGoalThunk } from "@/store/thunk/userStats/changeDailyGoalThunk";
import { changeNameThunk } from "@/store/thunk/userStats/changeNameThunk";
import { resetUserStatsThunk } from "@/store/thunk/userStats/resetUserStatsThunk";
import { useSQLiteContext } from "expo-sqlite";
import { useDispatch } from "react-redux";

export function useUserStats() {
  const dispatch = useDispatch<AppDispatch>();
  const db = useSQLiteContext();
  const name = useAppSelector((s) => s.stats.name);
  const streak = useAppSelector((s) => s.stats.streak);
  const lastLearningDate = useAppSelector((s) => s.stats.lastLearningDate);
  const reviewedToday = useAppSelector((s) => s.stats.reviewedToday);
  const dailyGoal = useAppSelector((s) => s.stats.dailyGoal);

  // todo refactor
  const changeGoal = async (goal: number) => {
    dispatch(changeDailyGoalThunk(goal));
    dispatch(loadDailyWordSetThunk({ db, dailyGoalOverload: goal }));
  };
  const changeName = (name: string) => dispatch(changeNameThunk(name));
  const resetUserStats = () => dispatch(resetUserStatsThunk());

  return {
    name,
    streak,
    lastLearningDate,
    reviewedToday,
    dailyGoal,
    changeGoal,
    changeName,
    resetUserStats,
  };
}
