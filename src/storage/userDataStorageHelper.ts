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
  LOCALE = "locale",
  SOUND_ENABLED = "soundEnabled",
  HAPTICS_ENABLED = "hapticsEnabled",
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
  locale: undefined,
  soundEnabled: true,
  hapticsEnabled: true,
};

function mapStorageValueToUserData<K extends USER_DATA_KEYS>(key: K, value: string | null): UserData[K] {
  if (value == null) return DEFAULT_USER_DATA[key];

  switch (key) {
    case USER_DATA_KEYS.TOTAL_LEARNED_WORDS:
    case USER_DATA_KEYS.STREAK:
    case USER_DATA_KEYS.REVIEWED_TODAY:
    case USER_DATA_KEYS.LEARNED_TODAY:
    case USER_DATA_KEYS.DAILY_GOAL:
      return Number(value) as UserData[K];
    case USER_DATA_KEYS.DAILY_GOAL_ACHIEVE:
    case USER_DATA_KEYS.SOUND_ENABLED:
    case USER_DATA_KEYS.HAPTICS_ENABLED:
      return (value === "true") as UserData[K];
    default:
      return value as UserData[K];
  }
}

export async function getUserProp<K extends USER_DATA_KEYS>(key: K): Promise<UserData[K]> {
  const raw = await Storage.getItem(key);
  return mapStorageValueToUserData(key, raw);
}

export async function getMultipleUserProps<K extends USER_DATA_KEYS>(keys: K[]): Promise<Pick<UserData, K>> {
  const values = await Storage.multiGet(keys);
  const result = {} as Pick<UserData, K>;

  for (const [key, value] of values) {
    const k = key as K;
    result[k] = mapStorageValueToUserData(k, value);
  }
  return result;
}

export async function getAllUserProps(): Promise<UserData> {
  const values = await Storage.multiGet(ALL_USER_DATA_KEYS);
  let result: UserData = { ...DEFAULT_USER_DATA };
  for (const [key, value] of values) {
    const enumKey = key as USER_DATA_KEYS;
    const mapped = mapStorageValueToUserData(enumKey, value);
    (result as any)[enumKey] = mapped;
  }
  return result;
}

export async function setUserProp<K extends USER_DATA_KEYS>(key: K, value: UserData[K]) {
  await Storage.setItem(key, String(value));
}

export async function setMultipleUserProps<K extends USER_DATA_KEYS>(fields: [K, UserData[K]][]) {
  await Storage.multiSet(fields.map(([key, value]) => [key, String(value)]));
}
