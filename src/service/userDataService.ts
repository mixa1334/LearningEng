import { dateHelper, DateShifts } from "@/src/util/dateHelper";
import { stringHelper } from "@/src/util/stringHelper";
import Storage from "expo-sqlite/kv-store";
import { StorageData, UserData } from "../entity/types";
import {
  ALL_STORAGE_KEYS,
  DEFAULT_STORAGE_DATA,
  getAllUserProps,
  getMultipleUserProps,
  getUserProp,
  setMultipleUserProps,
  setUserProp,
  STORAGE_KEYS,
} from "../storage/userDataStorageHelper";

class UserDataService {

  async changeName(name: string): Promise<string> {
    const oldName = await getUserProp(STORAGE_KEYS.NAME);
    const trimmedName = stringHelper.processTextBeforeSaving(name);
    if (oldName !== trimmedName) {
      setUserProp(STORAGE_KEYS.NAME, trimmedName);
    }
    return trimmedName;
  }

  async resetUserData(): Promise<UserData> {
    await Storage.multiRemove(ALL_STORAGE_KEYS);
    return { ...DEFAULT_STORAGE_DATA };
  }

  async changeDailyGoal(newDailyGoal: number): Promise<{
    dailyGoal: number;
    streak: number;
    dailyGoalAchieve: boolean;
  }> {
    const dailyGoal = Math.max(1, newDailyGoal);
    let { learnedToday, streak, dailyGoalAchieve } = await getMultipleUserProps([
      STORAGE_KEYS.LEARNED_TODAY,
      STORAGE_KEYS.STREAK,
      STORAGE_KEYS.DAILY_GOAL_ACHIEVE,
    ]);
    let newProps = [[STORAGE_KEYS.DAILY_GOAL, dailyGoal]] as [STORAGE_KEYS, StorageData[STORAGE_KEYS]][];

    if (!dailyGoalAchieve && dailyGoal <= learnedToday) {
      streak++;
      dailyGoalAchieve = true;
      newProps.push([STORAGE_KEYS.STREAK, streak], [STORAGE_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve]);
    } else if (dailyGoalAchieve && dailyGoal > learnedToday) {
      dailyGoalAchieve = false;
      streak = Math.max(0, streak - 1);
      newProps.push([STORAGE_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve], [STORAGE_KEYS.STREAK, streak]);
    }
    setMultipleUserProps(newProps);
    return { dailyGoal, streak, dailyGoalAchieve };
  }

  async updateAfterLearningWord(): Promise<{
    learnedToday: number;
    totalLearnedWords: number;
    streak: number;
    lastLearningDate: string;
    dailyGoalAchieve: boolean;
  }> {
    const todayDate = dateHelper.getCurrentDate();

    let { learnedToday, totalLearnedWords, streak, lastLearningDate, dailyGoal, dailyGoalAchieve } = await getMultipleUserProps([
      STORAGE_KEYS.LEARNED_TODAY,
      STORAGE_KEYS.TOTAL_LEARNED_WORDS,
      STORAGE_KEYS.STREAK,
      STORAGE_KEYS.LAST_LEARNING_DATE,
      STORAGE_KEYS.DAILY_GOAL,
      STORAGE_KEYS.DAILY_GOAL_ACHIEVE,
    ]);

    learnedToday++;
    totalLearnedWords++;
    let newProps = [
      [STORAGE_KEYS.LEARNED_TODAY, learnedToday],
      [STORAGE_KEYS.TOTAL_LEARNED_WORDS, totalLearnedWords],
    ] as [STORAGE_KEYS, StorageData[STORAGE_KEYS]][];

    if (lastLearningDate !== todayDate) {
      lastLearningDate = todayDate;
      newProps.push([STORAGE_KEYS.LAST_LEARNING_DATE, lastLearningDate]);
    }
    if (!dailyGoalAchieve && dailyGoal <= learnedToday) {
      dailyGoalAchieve = true;
      streak++;
      newProps.push([STORAGE_KEYS.DAILY_GOAL_ACHIEVE, dailyGoalAchieve], [STORAGE_KEYS.STREAK, streak]);
    }
    setMultipleUserProps(newProps);
    return { learnedToday, totalLearnedWords, streak, lastLearningDate, dailyGoalAchieve };
  }

  async updateAfterReviewingWord(): Promise<{
    reviewedToday: number;
  }> {
    let reviewedToday = await getUserProp(STORAGE_KEYS.REVIEWED_TODAY);
    reviewedToday++;
    setUserProp(STORAGE_KEYS.REVIEWED_TODAY, reviewedToday);
    return { reviewedToday };
  }

  async loadUserData(): Promise<UserData> {
    const userProps = await getAllUserProps();
    const today = dateHelper.getCurrentDate();
    const yesterday = dateHelper.getCurrentDate(DateShifts.yesterday);
    if (userProps.lastLearningDate !== today) {
      await this.resetUserDailyProgress(userProps);
      if (userProps.lastLearningDate !== yesterday && userProps.lastLearningDate !== today) {
        await this.resetUserStreak(userProps);
      }
    }
    return userProps;
  }

  private async resetUserDailyProgress(userData: UserData): Promise<void> {
    userData.dailyGoalAchieve = false;
    userData.learnedToday = 0;
    userData.reviewedToday = 0;
    await setMultipleUserProps([
      [STORAGE_KEYS.DAILY_GOAL_ACHIEVE, userData.dailyGoalAchieve],
      [STORAGE_KEYS.LEARNED_TODAY, userData.learnedToday],
      [STORAGE_KEYS.REVIEWED_TODAY, userData.reviewedToday],
    ]);
  }

  private async resetUserStreak(userData: UserData): Promise<void> {
    userData.streak = 0;
    await setUserProp(STORAGE_KEYS.STREAK, userData.streak);
  }
}

export const userDataService = new UserDataService();
