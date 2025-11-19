import type { Category, Word } from "@/model/entity/types";
import type { SQLiteDatabase } from "expo-sqlite";

function rowToWord(row: any): Word {
  return {
    id: row.id,
    word_en: row.word_en,
    word_ru: row.word_ru,
    transcription: row.transcription,
    type: row.type,
    learned: !!row.learned,
    next_review: row.next_review,
    priority: row.priority,
    text_example: row.text_example,
    category: {
      id: row.category_id,
      name: row.category_name,
      type: row.category_type,
      icon: row.category_icon,
    } as Category,
  };
}


export async function getDueWords(db: SQLiteDatabase): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(`
    SELECT
      w.id, w.word_en, w.word_ru, w.transcription, w.type, w.learned,
      w.next_review, w.priority, w.text_example, w.category_id,
      c.name AS category_name, c.type AS category_type, c.icon AS category_icon
    FROM words w
    JOIN categories c ON c.id = w.category_id
    WHERE w.learned = 0
      AND datetime(w.next_review) <= datetime('now')
    ORDER BY datetime(w.next_review) ASC
    LIMIT 10;
  `);
  return rows.map(rowToWord);
}

export async function markWordLearned(db: SQLiteDatabase, id: number): Promise<boolean> {
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


