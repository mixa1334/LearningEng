import { dateHelper, DateShifts } from "@/src/util/DateHelper";
import Storage from "expo-sqlite/kv-store";
import { Language, THEMES, UserData } from "../entity/types";
import {
  ALL_USER_DATA_KEYS,
  DEFAULT_USER_DATA,
  getAllUserProps,
  getMultipleUserProps,
  getUserProp,
  setMultipleUserProps,
  setUserProp,
  USER_DATA_KEYS,
} from "../storage/userDataStorageHelper";
import { stringHelper } from "@/src/util/StringHelper";

export async function getUserHapticsEnabled(): Promise<boolean> {
  return getUserProp(USER_DATA_KEYS.HAPTICS_ENABLED);
}

export async function setUserHapticsEnabled(hapticsEnabled: boolean): Promise<boolean> {
  const oldHapticsEnabled = await getUserProp(USER_DATA_KEYS.HAPTICS_ENABLED);
  if (oldHapticsEnabled !== hapticsEnabled) {
    setUserProp(USER_DATA_KEYS.HAPTICS_ENABLED, hapticsEnabled);
  }
  return oldHapticsEnabled;
}

export async function getUserSoundEnabled(): Promise<boolean> {
  return getUserProp(USER_DATA_KEYS.SOUND_ENABLED);
}

export async function setUserSoundEnabled(soundEnabled: boolean): Promise<boolean> {
  const oldSoundEnabled = await getUserProp(USER_DATA_KEYS.SOUND_ENABLED);
  if (oldSoundEnabled !== soundEnabled) {
    setUserProp(USER_DATA_KEYS.SOUND_ENABLED, soundEnabled);
  }
  return oldSoundEnabled;
}

export async function getUserLocale(): Promise<Language | undefined> {
  return getUserProp(USER_DATA_KEYS.LOCALE);
}

export async function setUserLocale(locale: Language): Promise<Language | undefined> {
  const oldLocale = await getUserProp(USER_DATA_KEYS.LOCALE);
  if (oldLocale !== locale) {
    setUserProp(USER_DATA_KEYS.LOCALE, locale);
  }
  return oldLocale;
}

export async function getUserTheme(): Promise<THEMES> {
  return getUserProp(USER_DATA_KEYS.THEME);
}

export async function setUserTheme(theme: THEMES): Promise<THEMES> {
  const oldTheme = await getUserProp(USER_DATA_KEYS.THEME);
  if (oldTheme !== theme) {
    setUserProp(USER_DATA_KEYS.THEME, theme);
  }
  return oldTheme;
}

export async function changeName(name: string): Promise<string> {
  const oldName = await getUserProp(USER_DATA_KEYS.NAME);
  const trimmedName = stringHelper.trimTextForSaving(name);
  if (oldName !== trimmedName) {
    setUserProp(USER_DATA_KEYS.NAME, trimmedName);
  }
  return trimmedName;
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
  let { learnedToday, streak, dailyGoalAchieve } = await getMultipleUserProps([
    USER_DATA_KEYS.LEARNED_TODAY,
    USER_DATA_KEYS.STREAK,
    USER_DATA_KEYS.DAILY_GOAL_ACHIEVE,
  ]);
  let newProps = [[USER_DATA_KEYS.DAILY_GOAL, dailyGoal]] as [USER_DATA_KEYS, UserData[USER_DATA_KEYS]][];

  if (!dailyGoalAchieve && dailyGoal <= learnedToday) {
    streak++;
    dailyGoalAchieve = true;
    newProps.push([USER_DATA_KEYS.STREAK, streak], [USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve]);
  } else if (dailyGoalAchieve && dailyGoal > learnedToday) {
    dailyGoalAchieve = false;
    streak = Math.max(0, streak - 1);
    newProps.push([USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve], [USER_DATA_KEYS.STREAK, streak]);
  }
  setMultipleUserProps(newProps);
  return { dailyGoal, streak, dailyGoalAchieve };
}

export async function updateAfterLearningWord(): Promise<{
  learnedToday: number;
  totalLearnedWords: number;
  streak: number;
  lastLearningDate: string;
  dailyGoalAchieve: boolean;
}> {
  const todayDate = dateHelper.getCurrentDate();

  let { learnedToday, totalLearnedWords, streak, lastLearningDate, dailyGoal, dailyGoalAchieve } = await getMultipleUserProps([
    USER_DATA_KEYS.LEARNED_TODAY,
    USER_DATA_KEYS.TOTAL_LEARNED_WORDS,
    USER_DATA_KEYS.STREAK,
    USER_DATA_KEYS.LAST_LEARNING_DATE,
    USER_DATA_KEYS.DAILY_GOAL,
    USER_DATA_KEYS.DAILY_GOAL_ACHIEVE,
  ]);

  learnedToday++;
  totalLearnedWords++;
  let newProps = [
    [USER_DATA_KEYS.LEARNED_TODAY, learnedToday],
    [USER_DATA_KEYS.TOTAL_LEARNED_WORDS, totalLearnedWords],
  ] as [USER_DATA_KEYS, UserData[USER_DATA_KEYS]][];

  if (lastLearningDate !== todayDate) {
    lastLearningDate = todayDate;
    newProps.push([USER_DATA_KEYS.LAST_LEARNING_DATE, lastLearningDate]);
  }
  if (!dailyGoalAchieve && dailyGoal <= learnedToday) {
    dailyGoalAchieve = true;
    streak++;
    newProps.push([USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve], [USER_DATA_KEYS.STREAK, streak]);
  }
  setMultipleUserProps(newProps);
  return { learnedToday, totalLearnedWords, streak, lastLearningDate, dailyGoalAchieve };
}

export async function updateAfterReviewingWord(): Promise<{
  reviewedToday: number;
}> {
  let reviewedToday = await getUserProp(USER_DATA_KEYS.REVIEWED_TODAY);
  reviewedToday++;
  setUserProp(USER_DATA_KEYS.REVIEWED_TODAY, reviewedToday);
  return { reviewedToday };
}

export async function loadUserData(): Promise<UserData> {
  const userProps = await getAllUserProps();
  const today = dateHelper.getCurrentDate();
  const yesterday = dateHelper.getCurrentDate(DateShifts.yesterday);
  if (userProps.lastLearningDate !== today) {
    resetUserDailyProgress(userProps);
    if (userProps.lastLearningDate !== yesterday && userProps.lastLearningDate !== today) {
      resetUserStreak(userProps);
    }
  }
  return userProps;
}

function resetUserDailyProgress(userData: UserData) {
  userData.dailyGoalAchieve = false;
  userData.learnedToday = 0;
  userData.reviewedToday = 0;
  setMultipleUserProps([
    [USER_DATA_KEYS.DAILY_GOAL_ACHIEVE, userData.dailyGoalAchieve],
    [USER_DATA_KEYS.LEARNED_TODAY, userData.learnedToday],
    [USER_DATA_KEYS.REVIEWED_TODAY, userData.reviewedToday],
  ]);
}

function resetUserStreak(userData: UserData) {
  userData.streak = 0;
  setUserProp(USER_DATA_KEYS.STREAK, userData.streak);
}
