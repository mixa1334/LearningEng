import { EntityType, type Word } from "@/src/entity/types";
import { stringHelper } from "@/src/util/StringHelper";
import { getDbInstance } from "../database/db";
import { NewWordDto } from "../dto/NewWordDto";
import { UpdateWordDto } from "../dto/UpdateWordDto";
import { rowToWord } from "../mapper/typesMapper";
import { WordCriteria } from "./WordCriteria";

const SELECT_WORDS = `SELECT
      w.id, w.word_en, w.word_ru, w.type, w.learned,
      w.next_review, w.priority, w.text_example, w.category_id,
      c.name AS category_name, c.type AS category_type, c.icon AS category_icon
    FROM words w
    JOIN categories c ON c.id = w.category_id
`;

const INSERT_WORD = `INSERT INTO words (word_en, word_ru, type, learned, category_id, next_review, priority, text_example) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

export async function deleteAllUserWords(): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync("DELETE FROM words WHERE type = 'user_added'");
  return deletedRows.changes > 0;
}

export async function resetWordLearningProgress(): Promise<void> {
  await getDbInstance().runAsync("UPDATE words SET learned = 0, priority = 0, next_review = datetime('now')");
}

export async function addNewWordsBatch(newWords: NewWordDto[], wordType: EntityType = EntityType.useradd): Promise<void> {
  if (!newWords.length) {
    return;
  }

  const db = getDbInstance();
  const reviewDate = new Date().toISOString();

  const PARAMS_PER_WORD = 8;
  const MAX_PARAMS = 900;
  const BATCH_SIZE = Math.max(1, Math.floor(MAX_PARAMS / PARAMS_PER_WORD));

  await db.withExclusiveTransactionAsync(async (tx) => {
    for (let i = 0; i < newWords.length; i += BATCH_SIZE) {
      const batch = newWords.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
      const sql = `INSERT INTO words (word_en, word_ru, type, learned, category_id, next_review, priority, text_example) VALUES ${placeholders}`;

      const params: (string | number | EntityType)[] = [];
      for (const word of batch) {
        params.push(
          stringHelper.trimTextForSaving(word.word_en),
          stringHelper.trimTextForSaving(word.word_ru),
          wordType,
          0,
          word.category_id,
          reviewDate,
          0,
          stringHelper.trimTextForSaving(word.text_example)
        );
      }

      await tx.runAsync(sql, params);
    }
  });
}

export async function addNewWord(newWord: NewWordDto, wordType: EntityType = EntityType.useradd): Promise<number> {
  const reviewDate = new Date().toISOString();
  const insertedRow = await getDbInstance().runAsync(INSERT_WORD, [
    stringHelper.trimTextForSaving(newWord.word_en),
    stringHelper.trimTextForSaving(newWord.word_ru),
    wordType,
    +false,
    newWord.category_id,
    reviewDate,
    0,
    stringHelper.trimTextForSaving(newWord.text_example),
  ]);
  return insertedRow.lastInsertRowId;
}

export async function deleteUserWord(wordToDelete: Word): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(
    `DELETE FROM words 
    WHERE type = 'user_added' AND id = ?`,
    [wordToDelete.id]
  );
  return deletedRows.changes > 0;
}

export async function editUserWord(word: UpdateWordDto): Promise<boolean> {
  let result = false;
  await getDbInstance().withExclusiveTransactionAsync(async (tx) => {
    const existingCategory = await tx.getFirstAsync<{ id: number }>(`SELECT id FROM categories WHERE id = ?;`, [
      word.category_id,
    ]);

    if (!existingCategory) {
      throw new Error(`Category with id ${word.category_id} does not exist`);
    }

    const updatedRows = await tx.runAsync(
      `UPDATE words SET word_en = ?, word_ru = ?, category_id = ?, text_example = ?
      WHERE type = 'user_added' AND id = ?`,
      [
        stringHelper.trimTextForSaving(word.word_en),
        stringHelper.trimTextForSaving(word.word_ru),
        word.category_id,
        stringHelper.trimTextForSaving(word.text_example),
        word.id,
      ]
    );

    result = updatedRows.changes > 0;
  });
  return result;
}

export async function getWordsByCriteria(criteria: WordCriteria): Promise<Word[]> {
  const condition = criteria.buildCondition();
  const rows = await getDbInstance().getAllAsync<any>(
    `${SELECT_WORDS}
    WHERE ${condition}`
  );
  return rows.map(rowToWord);
}

export async function getDailyWordsToLearn(limit: number = 5): Promise<Word[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `${SELECT_WORDS}
    WHERE w.learned = 0
      AND w.priority = 0
    ORDER BY w.id DESC
    LIMIT ?`,
    [limit]
  );
  const ws = rows.map(rowToWord);
  return ws;
}

export async function getDailyWordsToReview(): Promise<Word[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `${SELECT_WORDS}
    WHERE w.learned = 0
      AND datetime(w.next_review) <= datetime('now')
      AND w.priority > 0
    ORDER BY datetime(w.next_review) ASC;`
  );
  return rows.map(rowToWord);
}

export async function startLearningWord(word: Word): Promise<void> {
  await getDbInstance().runAsync(
    `UPDATE words
     SET priority = ?
     WHERE id = ?;`,
    [1, word.id]
  );
}

export async function markWordCompletelyLearned(word: Word): Promise<void> {
  await getDbInstance().runAsync(
    `UPDATE words
     SET learned = ?
     WHERE id = ?;`,
    [1, word.id]
  );
}

function getNextReviewSchedule(priority: number): {
  offsetExpr: string;
  isLearned: number;
} {
  const minuteSchedule = [5, 10, 30, 60, 120, 240];

  if (priority <= minuteSchedule.length) {
    const minutes = minuteSchedule[priority - 1];
    return {
      offsetExpr: `+${minutes} minutes`,
      isLearned: 0,
    };
  }

  const daySchedule = [1, 2, 4, 7, 14, 30, 50];
  const dayIndex = priority - minuteSchedule.length - 1;
  const days = daySchedule[Math.min(dayIndex, daySchedule.length - 1)];

  return {
    offsetExpr: `+${days} days`,
    isLearned: +(days >= 50),
  };
}

export async function reviewWord(word: Word): Promise<void> {
  const newPriority = word.priority + 1;
  const { offsetExpr, isLearned } = getNextReviewSchedule(newPriority);

  await getDbInstance().runAsync(
    `UPDATE words
     SET next_review = datetime('now', ?),
         priority = ?,
         learned = ?
     WHERE id = ?;`,
    [offsetExpr, newPriority, isLearned, word.id]
  );
}
