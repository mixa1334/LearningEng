import categoriesSeed from "@/assets/categories.json";
import wordsSeed from "@/assets/words.json";
import {
  COUNT_CATEGORIES,
  INSERT_INTO_CATEGORIES,
} from "@/constants/sql/categoriesTable";
import { SCHEMA_CREATION_IF_NOT_EXISTS } from "@/constants/sql/schema";
import { COUNT_WORDS, INSERT_INTO_WORDS } from "@/constants/sql/wordsTable";
import type { SQLiteDatabase } from "expo-sqlite";
import { wordToRow } from "../mapper/wordMapper";

export async function runMigrations(db: SQLiteDatabase) {
  await createSchema(db);

  if (await needToSeed(db, COUNT_CATEGORIES)) {
    const categoryRows = categoriesSeed.map((c) => [c.name, c.type, c.icon]);
    await seedTable(db, INSERT_INTO_CATEGORIES, categoryRows);
  }

  if (await needToSeed(db, COUNT_WORDS)) {
    const wordRows = wordsSeed.map((w) => {
      w.next_review = new Date().toISOString();
      return wordToRow(w);
    });
    await seedTable(db, INSERT_INTO_WORDS, wordRows);
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

async function seedTable(db: SQLiteDatabase, insertSQL: string, rows: any[][]) {
  await db.execAsync("BEGIN TRANSACTION;");
  try {
    for (const row of rows) {
      await db.runAsync(insertSQL, row);
    }
    await db.execAsync("COMMIT;");
  } catch (err) {
    await db.execAsync("ROLLBACK;");
    throw err;
  }
}
