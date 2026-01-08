import { useAppDispatch, useAppSelector } from "@/src/store";
import { resetLearningStatsThunk } from "@/src/store/slice/learnSlice";
import { changeDailyGoalThunk, changeNameThunk, resetUserDataThunk } from "@/src/store/slice/userDataSlice";
import { removeUserVocabularyThunk } from "../store/slice/vocabularySlice";

export function useUserData() {
  const dispatch = useAppDispatch();
  const { name, totalLearnedWords, streak, lastLearningDate, reviewedToday, learnedToday, dailyGoal, dailyGoalAchieve } =
    useAppSelector((s) => s.userData);

  const changeGoal = (goal: number) => dispatch(changeDailyGoalThunk({ newDailyGoal: goal }));
  const changeName = (name: string) => dispatch(changeNameThunk(name));
  const resetUserStats = () => dispatch(resetUserDataThunk());
  const resetWordsProgress = () => dispatch(resetLearningStatsThunk());
  const removeUserVocabulary = () => dispatch(removeUserVocabularyThunk());

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
    removeUserVocabulary,
  };
}
