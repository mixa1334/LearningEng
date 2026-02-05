import Storage from "expo-sqlite/kv-store";
import { Appearance } from "react-native";
import { StorageData, THEMES, TranslatorEngine } from "../entity/types";

export enum STORAGE_KEYS {
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
  TRANSLATOR_ENGINE = "translatorEngine",
  DELETE_TRANSLATION_AFTER_ADDING_TO_VOCABULARY = "deleteTranslationAfterAddingToVocabulary",
  CLEAR_TRANSLATOR_INPUT_FIELD = "clearTranslatorInputField",
}

export const ALL_STORAGE_KEYS = Object.values(STORAGE_KEYS) as string[];

export const DEFAULT_STORAGE_DATA: StorageData = {
  name: "User",
  totalLearnedWords: 0,
  streak: 0,
  lastLearningDate: undefined,
  reviewedToday: 0,
  learnedToday: 0,
  dailyGoal: 5,
  dailyGoalAchieve: false,
  // todo: use system theme
  // theme: Appearance.getColorScheme() === "dark" ? THEMES.DARK : THEMES.LIGHT,
  theme: Appearance.getColorScheme() === "dark" ? THEMES.DARK : THEMES.LIGHT,
  locale: undefined,
  soundEnabled: true,
  hapticsEnabled: true,
  translatorEngine: TranslatorEngine.FREE_API,
  deleteTranslationAfterAddingToVocabulary: false,
  clearTranslatorInputField: false,
};

function mapValueToData<K extends STORAGE_KEYS>(key: K, value: string | null): StorageData[K] {
  if (value == null) return DEFAULT_STORAGE_DATA[key];

  switch (key) {
    case STORAGE_KEYS.TOTAL_LEARNED_WORDS:
    case STORAGE_KEYS.STREAK:
    case STORAGE_KEYS.REVIEWED_TODAY:
    case STORAGE_KEYS.LEARNED_TODAY:
    case STORAGE_KEYS.DAILY_GOAL:
      return Number(value) as StorageData[K];
    case STORAGE_KEYS.DAILY_GOAL_ACHIEVE:
    case STORAGE_KEYS.SOUND_ENABLED:
    case STORAGE_KEYS.HAPTICS_ENABLED:
    case STORAGE_KEYS.DELETE_TRANSLATION_AFTER_ADDING_TO_VOCABULARY:
    case STORAGE_KEYS.CLEAR_TRANSLATOR_INPUT_FIELD:
      return (value === "true") as StorageData[K];
    default:
      return value as StorageData[K];
  }
}

export async function getUserProp<K extends STORAGE_KEYS>(key: K): Promise<StorageData[K]> {
  const raw = await Storage.getItem(key);
  return mapValueToData(key, raw);
}

export async function getMultipleUserProps<K extends STORAGE_KEYS>(keys: K[]): Promise<Pick<StorageData, K>> {
  const values = await Storage.multiGet(keys);
  const result = {} as Pick<StorageData, K>;

  for (const [key, value] of values) {
    const k = key as K;
    result[k] = mapValueToData(k, value);
  }
  return result;
}

export async function getAllUserProps(): Promise<StorageData> {
  const values = await Storage.multiGet(ALL_STORAGE_KEYS);
  let result: StorageData = { ...DEFAULT_STORAGE_DATA };
  for (const [key, value] of values) {
    const enumKey = key as STORAGE_KEYS;
    const mapped = mapValueToData(enumKey, value);
    (result as any)[enumKey] = mapped;
  }
  return result;
}

export async function setUserProp<K extends STORAGE_KEYS>(key: K, value: StorageData[K]) {
  await Storage.setItem(key, String(value));
}

export async function setMultipleUserProps<K extends STORAGE_KEYS>(fields: [K, StorageData[K]][]) {
  await Storage.multiSet(fields.map(([key, value]) => [key, String(value)]));
}
