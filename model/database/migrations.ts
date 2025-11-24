import categoriesSeed from "@/assets/data/categories.json";
import wordsSeed from "@/assets/data/words.json";
import { COUNT_CATEGORIES } from "@/constants/sql/categoriesTable";
import { SCHEMA_CREATION_IF_NOT_EXISTS } from "@/constants/sql/schema";
import { COUNT_WORDS } from "@/constants/sql/wordsTable";
import type { SQLiteDatabase } from "expo-sqlite";
import { EntityType } from "../entity/types";
import { addNewCategory } from "../repository/categoryService";
import { addNewWord } from "../repository/wordService";

export async function runMigrations(db: SQLiteDatabase) {
  await createSchema(db);

  if (await needToSeed(db, COUNT_CATEGORIES)) {
    for (const c of categoriesSeed) {
      await addNewCategory(db, c, EntityType.preloaded);
    }
  }

  if (await needToSeed(db, COUNT_WORDS)) {
    for (const w of wordsSeed) {
      await addNewWord(db, w, EntityType.preloaded);
    }
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
