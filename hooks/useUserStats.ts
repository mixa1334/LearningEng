import { AppDispatch, useAppSelector } from "@/store";
import { changeDailyGoalThunk } from "@/store/thunk/userStats/changeDailyGoalThunk";
import { changeNameThunk } from "@/store/thunk/userStats/changeNameThunk";
import { updateStatsAfterLearnThunk } from "@/store/thunk/userStats/updateStatsAfterLearnThunk";
import { useDispatch } from "react-redux";

export function useUserStats() {
  const dispatch = useDispatch<AppDispatch>();

  const name = useAppSelector((s) => s.stats.name);
  const streak = useAppSelector((s) => s.stats.streak);
  const lastLearningDate = useAppSelector((s) => s.stats.lastLearningDate);
  const reviewedToday = useAppSelector((s) => s.stats.reviewedToday);
  const dailyGoal = useAppSelector((s) => s.stats.dailyGoal);

  const changeGoal = (goal: number) => dispatch(changeDailyGoalThunk(goal));
  const updateStatsAfterLearning = () => dispatch(updateStatsAfterLearnThunk());
  const changeName = (name: string) => dispatch(changeNameThunk(name));

  return {
    name,
    streak,
    lastLearningDate,
    reviewedToday,
    dailyGoal,
    changeGoal,
    changeName,
    updateStatsAfterLearning,
  };
}
