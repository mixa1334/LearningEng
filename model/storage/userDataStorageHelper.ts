import Storage from "expo-sqlite/kv-store";
import { THEMES, UserData } from "../entity/types";

export enum USER_DATA_KEYS {
  NAME = "name",
  TOTAL_LEARNED_WORDS = "totalLearnedWords",
  STREAK = "streak",
  LAST_LEARNING_DATE = "lastLearningDate",
  REVIEWED_TODAY = "reviewedToday",
  LEARNED_TODAY = "learnedToday",
  DAILY_GOAL = "dailyGoal",
  DAILY_GOAL_ACHIEVE = "dailyGoalAchieve",
  THEME = "theme",
}

export const ALL_USER_DATA_KEYS = Object.values(USER_DATA_KEYS) as string[];

export const DEFAULT_USER_DATA: UserData = {
  name: "User",
  totalLearnedWords: 0,
  streak: 0,
  lastLearningDate: undefined,
  reviewedToday: 0,
  learnedToday: 0,
  dailyGoal: 5,
  dailyGoalAchieve: false,
  theme: THEMES.LIGHT,
};

export function mapStorageValueToUserData<K extends USER_DATA_KEYS>(key: K, value: string | null): UserData[K] {
  if (value == null) return DEFAULT_USER_DATA[key];

  switch (key) {
    case USER_DATA_KEYS.TOTAL_LEARNED_WORDS:
    case USER_DATA_KEYS.STREAK:
    case USER_DATA_KEYS.REVIEWED_TODAY:
    case USER_DATA_KEYS.LEARNED_TODAY:
    case USER_DATA_KEYS.DAILY_GOAL:
      return Number(value) as UserData[K];
    case USER_DATA_KEYS.DAILY_GOAL_ACHIEVE:
      return (value === "true") as UserData[K];
    default:
      return value as UserData[K];
  }
}

export function retrieveUserField<K extends USER_DATA_KEYS>(key: K): UserData[K] {
  const raw = Storage.getItemSync(key);
  return mapStorageValueToUserData(key, raw);
}

export async function retrieveAllUserFields(): Promise<UserData> {
  const values = await Storage.multiGet(ALL_USER_DATA_KEYS);
  let result: UserData = { ...DEFAULT_USER_DATA };
  for (const [key, value] of values) {
    const enumKey = key as USER_DATA_KEYS;
    const mapped = mapStorageValueToUserData(enumKey, value);
    (result as any)[enumKey] = mapped;
  }
  return result;
}

export function setUserField<K extends USER_DATA_KEYS>(key: K, value: UserData[K]) {
  Storage.setItemSync(key, String(value));
}
