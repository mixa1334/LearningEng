import { useAppDispatch, useAppSelector } from "@/store";
import { resetLearningStatsThunk } from "@/store/slice/learnSlice";
import { changeDailyGoalThunk, changeNameThunk, resetUserDataThunk } from "@/store/slice/userDataSlice";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { name, totalLearnedWords, streak, lastLearningDate, reviewedToday, learnedToday, dailyGoal, dailyGoalAchieve } =
    useAppSelector((s) => s.userData);

  const changeGoal = (goal: number) => dispatch(changeDailyGoalThunk({ newDailyGoal: goal }));
  const changeName = (name: string) => dispatch(changeNameThunk(name));
  const resetUserStats = () => dispatch(resetUserDataThunk());
  const resetWordsProgress = () => dispatch(resetLearningStatsThunk());

  return {
    name,
    totalLearnedWords,
    streak,
    lastLearningDate,
    reviewedToday,
    learnedToday,
    dailyGoal,
    dailyGoalAchieve,
    changeGoal,
    changeName,
    resetUserStats,
    resetWordsProgress,
  };
}
