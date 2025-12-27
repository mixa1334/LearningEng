import { DateShifts, getCurrentDate } from "@/src/util/dateHelper";
import Storage from "expo-sqlite/kv-store";
import { THEMES, UserData } from "../entity/types";
import {
  ALL_USER_DATA_KEYS,
  DEFAULT_USER_DATA,
  retrieveAllUserFields,
  retrieveUserField,
  setUserField,
  USER_DATA_KEYS,
} from "../storage/userDataStorageHelper";

export async function getUserTheme(): Promise<THEMES> {
  return retrieveUserField(USER_DATA_KEYS.THEME);
}

export async function setUserTheme(theme: THEMES): Promise<THEMES> {
  const oldTheme = retrieveUserField(USER_DATA_KEYS.THEME);
  if (oldTheme !== theme) {
    setUserField(USER_DATA_KEYS.THEME, theme);
  }
  return oldTheme;
}

export async function changeName(name: string): Promise<string> {
  const oldName = retrieveUserField(USER_DATA_KEYS.NAME);
  if (oldName !== name) {
    setUserField(USER_DATA_KEYS.NAME, name);
  }
  return oldName;
}

export async function resetUserData(): Promise<UserData> {
  await Storage.multiRemove(ALL_USER_DATA_KEYS);
  return { ...DEFAULT_USER_DATA };
}

export async function changeDailyGoal(newDailyGoal: number): Promise<{
  dailyGoal: number;
  streak: number;
  dailyGoalAchieve: boolean;
}> {
  const dailyGoal = Math.max(1, newDailyGoal);
  const learnedToday = retrieveUserField(USER_DATA_KEYS.LEARNED_TODAY);
  let streak = retrieveUserField(USER_DATA_KEYS.STREAK);
  let dailyGoalAchieve = retrieveUserField(USER_DATA_KEYS.DAILY_GOAL_ACHIEVE);
  if (!dailyGoalAchieve && dailyGoal <= learnedToday) {
    streak++;
    setUserField(USER_DATA_KEYS.STREAK, streak);
    dailyGoalAchieve = true;
    setUserField(USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve);
  } else if (dailyGoalAchieve && dailyGoal > learnedToday) {
    dailyGoalAchieve = false;
    setUserField(USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve);
    if (streak > 0) {
      streak--;
      setUserField(USER_DATA_KEYS.STREAK, streak);
    }
  }
  setUserField(USER_DATA_KEYS.DAILY_GOAL, dailyGoal);
  return { dailyGoal, streak, dailyGoalAchieve };
}

export async function updateAfterLearningWord(): Promise<{
  learnedToday: number;
  totalLearnedWords: number;
  streak: number;
  lastLearningDate: string;
  dailyGoalAchieve: boolean;
}> {
  const todayDate = getCurrentDate();
  let learnedToday = retrieveUserField(USER_DATA_KEYS.LEARNED_TODAY);
  let totalLearnedWords = retrieveUserField(USER_DATA_KEYS.TOTAL_LEARNED_WORDS);
  let streak = retrieveUserField(USER_DATA_KEYS.STREAK);
  let lastLearningDate = retrieveUserField(USER_DATA_KEYS.LAST_LEARNING_DATE);
  const dailyGoal = retrieveUserField(USER_DATA_KEYS.DAILY_GOAL);
  let dailyGoalAchieve = retrieveUserField(USER_DATA_KEYS.DAILY_GOAL_ACHIEVE);

  learnedToday++;
  totalLearnedWords++;
  if (lastLearningDate !== todayDate) {
    lastLearningDate = todayDate;
    setUserField(USER_DATA_KEYS.LAST_LEARNING_DATE, lastLearningDate);
  }
  if (!dailyGoalAchieve && dailyGoal === learnedToday) {
    dailyGoalAchieve = true;
    setUserField(USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve);
    streak++;
    setUserField(USER_DATA_KEYS.STREAK, streak);
  }
  setUserField(USER_DATA_KEYS.LEARNED_TODAY, learnedToday);
  setUserField(USER_DATA_KEYS.TOTAL_LEARNED_WORDS, totalLearnedWords);
  return { learnedToday, totalLearnedWords, streak, lastLearningDate, dailyGoalAchieve };
}

export async function updateAfterReviewingWord(): Promise<{
  reviewedToday: number;
}> {
  let reviewedToday = retrieveUserField(USER_DATA_KEYS.REVIEWED_TODAY);
  reviewedToday++;
  setUserField(USER_DATA_KEYS.REVIEWED_TODAY, reviewedToday);
  return { reviewedToday };
}

export async function loadUserData(): Promise<UserData> {
  const userData = await retrieveAllUserFields();
  const today = getCurrentDate();
  const yesterday = getCurrentDate(DateShifts.yesterday);
  if (userData.lastLearningDate !== today) {
    resetUserDailyProgress(userData);
    if (userData.lastLearningDate !== yesterday && userData.lastLearningDate !== today) {
      resetUserStreak(userData);
    }
  }
  return userData;
}

function resetUserDailyProgress(userData: UserData) {
  userData.dailyGoalAchieve = false;
  setUserField(USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, userData.dailyGoalAchieve);
  userData.learnedToday = 0;
  setUserField(USER_DATA_KEYS.LEARNED_TODAY, userData.learnedToday);
  userData.reviewedToday = 0;
  setUserField(USER_DATA_KEYS.REVIEWED_TODAY, userData.reviewedToday);
}

function resetUserStreak(userData: UserData) {
  userData.streak = 0;
  setUserField(USER_DATA_KEYS.STREAK, userData.streak);
}
