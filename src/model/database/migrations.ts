import categoriesSeed from "@/assets/data/categories.json";
import wordsSeed from "@/assets/data/words.json";
import { SCHEMA_CREATION_IF_NOT_EXISTS } from "@/src/resources/sql/schema";
import type { SQLiteDatabase } from "expo-sqlite";
import { EntityType } from "../entity/types";
import { addNewCategoriesBatch } from "../service/categoryService";
import { addNewWordsBatch } from "../service/wordService";
import { setDbInstance } from "./db";

export async function runMigrations(db: SQLiteDatabase) {
  // Initialize global DB instance for the whole app
  setDbInstance(db);

  await createSchema(db);

  if (await needToSeed(db, `SELECT COUNT(*) as count FROM categories`)) {
    await addNewCategoriesBatch(categoriesSeed, EntityType.preloaded);
  }

  if (await needToSeed(db, `SELECT COUNT(*) as count FROM words`)) {
    await addNewWordsBatch(wordsSeed, EntityType.preloaded);
  }
}

async function createSchema(db: SQLiteDatabase) {
  await db.execAsync(SCHEMA_CREATION_IF_NOT_EXISTS);
}

async function needToSeed(
  db: SQLiteDatabase,
  countQuery: string
): Promise<boolean> {
  const result = await db.getFirstAsync<{ count: number }>(countQuery);
  return (result?.count ?? 0) === 0;
}
