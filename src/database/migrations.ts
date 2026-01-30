import categoriesSeed from "@/assets/data/categories.json";
import wordsSeed from "@/assets/data/words.json";
import { SCHEMA_ALTER_TO_V2, SCHEMA_CREATION_IF_NOT_EXISTS } from "@/src/resources/sql/schema";
import type { SQLiteDatabase } from "expo-sqlite";
import { EntityType } from "../entity/types";
import { addNewCategoriesBatch } from "../service/categoryService";
import { addNewWordsBatch } from "../service/wordService";
import { setDbInstance } from "./db";

const LATEST_VERSION = 2;

export async function runMigrations(db: SQLiteDatabase) {
  // Initialize global DB instance for the whole app
  setDbInstance(db);

  await db.execAsync('PRAGMA foreign_keys = OFF;');

  let { user_version } = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version') ?? { user_version: 0 };

  if (user_version === 0) {

    const migrationsNeedToBeRun = await checkIfMigrationsNeedToBeRun(db);

    if (migrationsNeedToBeRun) {
      await db.execAsync(SCHEMA_ALTER_TO_V2);
      user_version = 2;
    } else {
      await db.execAsync(SCHEMA_CREATION_IF_NOT_EXISTS);
      await addNewCategoriesBatch(categoriesSeed, EntityType.preloaded);
      await addNewWordsBatch(wordsSeed, EntityType.preloaded);
      user_version = LATEST_VERSION;
    }  
  }


  await db.execAsync(`PRAGMA user_version = ${user_version}`);

  await db.execAsync('PRAGMA foreign_keys = ON;');
}

async function checkIfMigrationsNeedToBeRun(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ exists: number }>(
    "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='translations') AS 'exists';"
  );
  return result?.exists === 1;
}