export enum THEMES {
  LIGHT = "light",
  DARK = "dark",
}

export enum EntityType {
  preloaded = "pre_loaded",
  useradd = "user_added",
}

export type Category = {
  id: number;
  name: string;
  type: EntityType;
  icon: string;
};

export type Word = {
  id: number;
  word_en: string;
  word_ru: string;
  type: EntityType;
  learned: boolean;
  category: Category;
  next_review: string;
  priority: number;
  text_example: string;
};

export type UserData = {
  name: string;
  totalLearnedWords: number;
  streak: number;
  lastLearningDate: string | undefined;
  reviewedToday: number;
  learnedToday: number;
  dailyGoal: number;
  dailyGoalAchieve: boolean;
  theme: THEMES;
  locale: Language | undefined;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};

export enum Language {
  ENGLISH = "en",
  RUSSIAN = "ru",
}

export type Translation = {
  id: number;
  text: string;
  text_language: Language;
  translated_array: string[];
  translation_date: string;
};

export type Statistics = {
  date: string;
  learned: number;
  reviewed: number;
  isGoalAchieved: boolean;
};
