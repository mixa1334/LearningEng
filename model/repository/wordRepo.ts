import type { Word } from "@/model/entity/types";
import type { SQLiteDatabase } from "expo-sqlite";
import { rowToWord } from "../mapper/wordMapper";

export async function getDailyWords(
  db: SQLiteDatabase,
  limit: number = 5
): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(
    `SELECT
      w.id, w.word_en, w.word_ru, w.transcription, w.type, w.learned,
      w.next_review, w.priority, w.text_example, w.category_id,
      c.name AS category_name, c.type AS category_type, c.icon AS category_icon
    FROM words w
    JOIN categories c ON c.id = w.category_id
    WHERE w.learned = 0
      AND datetime(w.next_review) <= datetime('now')
    ORDER BY datetime(w.next_review) ASC
    LIMIT ?;`,
    [limit]
  );
  return rows.map(rowToWord);
}

export async function markWordLearned(
  db: SQLiteDatabase,
  id: number
): Promise<boolean> {
  const current = await db.getFirstAsync<{ priority: number }>(
    "SELECT priority FROM words WHERE id = ?;",
    [id]
  );
  const days = current?.priority ?? 1;
  const newPriority = days * 2;
  const completed = newPriority > 50 ? 1 : 0;

  const result = await db.runAsync(
    `UPDATE words
     SET next_review = datetime('now', ?),
         priority = ?,
         learned = ?
     WHERE id = ?;`,
    [`+${days} days`, newPriority, completed, id]
  );
  return (result.changes ?? 0) > 0;
}
