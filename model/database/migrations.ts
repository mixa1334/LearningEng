import categoriesSeed from "@/assets/categories.json";
import wordsSeed from "@/assets/words.json";
import type { SQLiteDatabase } from "expo-sqlite";

export async function runMigrations(db: SQLiteDatabase) {
  await createSchema(db);

  if ((await getRowCount(db, "categories")) === 0) {
    const categoryRows = categoriesSeed.map((c) => [c.name, c.type, c.icon]);
    await seedTable(
      db,
      "INSERT INTO categories (name, type, icon) VALUES (?, ?, ?);",
      categoryRows
    );
  }

  if ((await getRowCount(db, "words")) === 0) {
    const wordRows = wordsSeed.map((w) => [
      w.word_en,
      w.word_ru,
      w.transcription,
      w.type ?? "pre_loaded",
      0,
      w.category_id,
      w.priority ?? 1,
      w.text_example,
    ]);
    await seedTable(
      db,
      `INSERT INTO words
       (word_en, word_ru, transcription, type, learned, category_id, priority, text_example)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      wordRows
    );
  }
}

async function createSchema(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('pre_loaded', 'user_added')) DEFAULT 'pre_loaded',
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_en TEXT NOT NULL,
      word_ru TEXT NOT NULL,
      transcription TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('pre_loaded', 'user_added')) DEFAULT 'pre_loaded',
      learned INTEGER NOT NULL DEFAULT 0,
      category_id INTEGER NOT NULL,
      next_review TEXT NOT NULL DEFAULT (datetime('now')),
      priority INTEGER NOT NULL DEFAULT 1,
      text_example TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);
}

async function getRowCount(db: SQLiteDatabase, table: string): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${table};`
  );
  return result?.count ?? 0;
}

async function seedTable(
  db: SQLiteDatabase,
  insertSQL: string,
  rows: any[][]
) {
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