import { getDbInstance } from "@/src/database/db";
import type { UserData } from "@/src/entity/types";
import { USER_DATA_KEYS, getAllUserProps, setMultipleUserProps } from "@/src/storage/userDataStorageHelper";
import { dateHelper } from "@/src/util/dateHelper";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

type BackupFileV1 = {
  version: 1;
  createdAt: string;
  userData: UserData;
  categories: {
    id: number;
    name: string;
    type: string;
    icon: string;
  }[];
  words: {
    id: number;
    word_en: string;
    word_ru: string;
    type: string;
    learned: number;
    category_id: number;
    next_review: string;
    priority: number;
    text_example: string;
  }[];
  translations: {
    id: number;
    text: string;
    text_language: string;
    translated_array: string;
    translation_date: string;
  }[];
};

const BACKUP_FILE_PREFIX = "pocket-eng-backup";

export async function createBackupFileAndShare(): Promise<void> {
  const db = getDbInstance();

  const userData = await getAllUserProps();

  const categories = await db.getAllAsync<BackupFileV1["categories"][number]>("SELECT id, name, type, icon FROM categories");

  const words = await db.getAllAsync<BackupFileV1["words"][number]>(
    "SELECT id, word_en, word_ru, type, learned, category_id, next_review, priority, text_example FROM words"
  );

  const translations = await db.getAllAsync<BackupFileV1["translations"][number]>(
    "SELECT id, text, text_language, translated_array, translation_date FROM translations"
  );

  const payload: BackupFileV1 = {
    version: 1,
    createdAt: new Date().toISOString(),
    userData,
    categories,
    words,
    translations,
  };

  const json = JSON.stringify(payload);

  const datePart = dateHelper.getCurrentDate();
  const fileName = `${BACKUP_FILE_PREFIX}-${datePart}.json`;
  const directory = Paths.cache ?? Paths.document;
  const file = new File(directory, fileName);
  file.write(json);
  const fileUri = file.uri;

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Export Pocket English backup",
      UTI: "public.json",
    });
  }
}

export async function restoreFromBackupFileUri(fileUri: string): Promise<void> {
  const db = getDbInstance();

  const file = new File(fileUri);
  const json = await file.text();

  let parsed: BackupFileV1;
  try {
    parsed = JSON.parse(json) as BackupFileV1;
  } catch {
    throw new Error("Selected file is not a valid backup (invalid JSON).");
  }

  if (parsed?.version !== 1) {
    throw new Error("Selected file is not a supported backup version.");
  }

  const { userData, categories, words, translations } = parsed;

  if (!userData || !Array.isArray(categories) || !Array.isArray(words) || !Array.isArray(translations)) {
    throw new Error("Selected file is missing required backup fields.");
  }
  const lastLearningDate = userData[USER_DATA_KEYS.LAST_LEARNING_DATE];
  if (lastLearningDate !== dateHelper.getCurrentDate()) {
    userData[USER_DATA_KEYS.DAILY_GOAL_ACHIEVE] = false;
    userData[USER_DATA_KEYS.LEARNED_TODAY] = 0;
    userData[USER_DATA_KEYS.REVIEWED_TODAY] = 0;
  }

  await setMultipleUserProps(Object.entries(userData) as [USER_DATA_KEYS, UserData[USER_DATA_KEYS]][]);

  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync("PRAGMA foreign_keys = OFF;");

    await tx.runAsync("DELETE FROM words;");
    await tx.runAsync("DELETE FROM categories;");
    await tx.runAsync("DELETE FROM translations;");

    for (const c of categories) {
      await tx.runAsync("INSERT INTO categories (id, name, type, icon) VALUES (?, ?, ?, ?);", [c.id, c.name, c.type, c.icon]);
    }

    for (const w of words) {
      await tx.runAsync(
        "INSERT INTO words (id, word_en, word_ru, type, learned, category_id, next_review, priority, text_example) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [w.id, w.word_en, w.word_ru, w.type, w.learned, w.category_id, w.next_review, w.priority, w.text_example]
      );
    }

    for (const t of translations) {
      await tx.runAsync("INSERT INTO translations (id, text, text_language, translated_array, translation_date) VALUES (?, ?, ?, ?, ?);", [
        t.id,
        t.text,
        t.text_language,
        t.translated_array,
        t.translation_date,
      ]);
    }

    await tx.execAsync("PRAGMA foreign_keys = ON;");
  });
}
