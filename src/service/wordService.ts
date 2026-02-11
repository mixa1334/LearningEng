import { EntityType, type Word } from "@/src/entity/types";
import { stringHelper } from "@/src/util/stringHelper";
import { getDbInstance } from "../database/db";
import { NewWordDto } from "../dto/NewWordDto";
import { rowToWord } from "../mapper/typesMapper";
import { Queryable } from "./criteria/Queryable";

const SELECT_WORDS = `SELECT
      w.id, w.word_en, w.word_ru, w.type, w.learned,
      w.next_review, w.priority, w.text_example, w.category_id,
      c.name AS category_name, c.type AS category_type, c.icon AS category_icon
    FROM words w
    JOIN categories c ON c.id = w.category_id
`;

const INSERT_WORD = `INSERT INTO words (word_en, word_ru, type, learned, category_id, next_review, priority, text_example) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

class WordService {

  async deleteAllUserWords(): Promise<boolean> {
    const deletedRows = await getDbInstance().runAsync("DELETE FROM words WHERE type = 'user_added'");
    return deletedRows.changes > 0;
  }

  async resetWordLearningProgress(): Promise<void> {
    await getDbInstance().runAsync("UPDATE words SET learned = 0, priority = 0, next_review = datetime('now')");
  }

  async addNewWordsBatch(newWords: NewWordDto[], wordType: EntityType = EntityType.useradd): Promise<void> {
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
            stringHelper.processTextBeforeSaving(word.word_en),
            stringHelper.processTextBeforeSaving(word.word_ru),
            wordType,
            0,
            word.category_id,
            reviewDate,
            0,
            stringHelper.processTextBeforeSaving(word.text_example)
          );
        }

        await tx.runAsync(sql, params);
      }
    });
  }

  async addNewWord(newWord: NewWordDto, wordType: EntityType = EntityType.useradd): Promise<number> {
    const reviewDate = new Date().toISOString();
    const insertedRow = await getDbInstance().runAsync(INSERT_WORD, [
      stringHelper.processTextBeforeSaving(newWord.word_en),
      stringHelper.processTextBeforeSaving(newWord.word_ru),
      wordType,
      +false,
      newWord.category_id,
      reviewDate,
      0,
      stringHelper.processTextBeforeSaving(newWord.text_example),
    ]);
    return insertedRow.lastInsertRowId;
  }

  async deleteUserWord(wordToDelete: Word): Promise<boolean> {
    const deletedRows = await getDbInstance().runAsync(
      `DELETE FROM words 
    WHERE type = 'user_added' AND id = ?`,
      [wordToDelete.id]
    );
    return deletedRows.changes > 0;
  }

  async editUserWord(word: Word): Promise<boolean> {
    let result = false;
    await getDbInstance().withExclusiveTransactionAsync(async (tx) => {
      const existingCategory = await tx.getFirstAsync<{ id: number }>(`SELECT id FROM categories WHERE id = ?;`, [
        word.category.id,
      ]);

      if (!existingCategory) {
        throw new Error(`Category with id ${word.category.id} does not exist`);
      }

      const updatedRows = await tx.runAsync(
        `UPDATE words SET word_en = ?, word_ru = ?, category_id = ?, text_example = ?
      WHERE type = 'user_added' AND id = ?`,
        [
          stringHelper.processTextBeforeSaving(word.word_en),
          stringHelper.processTextBeforeSaving(word.word_ru),
          word.category.id,
          stringHelper.processTextBeforeSaving(word.text_example),
          word.id,
        ]
      );

      result = updatedRows.changes > 0;
    });
    return result;
  }

  async getAllWords(queryable?: Queryable): Promise<Word[]> {
    const { query, params } = queryable?.buildQuery() ?? { query: "1 = 1", params: [] as any[] };
    const rows = await getDbInstance().getAllAsync<any>(
      `${SELECT_WORDS}
    WHERE ${query}`,
      params
    );
    return rows.map(rowToWord);
  }

  async getDailyWordsToLearn(limit: number = 5): Promise<Word[]> {
    const rows = await getDbInstance().getAllAsync<any>(
      `${SELECT_WORDS}
    WHERE w.learned = 0
      AND w.priority = 0
    ORDER BY w.id DESC
    LIMIT ?`,
      [limit]
    );
    return rows.map(rowToWord);
  }

  async getDailyWordsToReview(): Promise<Word[]> {
    const rows = await getDbInstance().getAllAsync<any>(
      `${SELECT_WORDS}
    WHERE w.learned = 0
      AND datetime(w.next_review) <= datetime('now')
      AND w.priority > 0
    ORDER BY datetime(w.next_review) ASC;`
    );
    return rows.map(rowToWord);
  }

  async startLearningWord(word: Word): Promise<void> {
    await getDbInstance().runAsync(
      `UPDATE words
     SET priority = ?
     WHERE id = ?;`,
      [1, word.id]
    );
  }

  async markWordCompletelyLearned(word: Word): Promise<void> {
    await getDbInstance().runAsync(
      `UPDATE words
     SET learned = ?
     WHERE id = ?;`,
      [1, word.id]
    );
  }

  private getNextReviewSchedule(priority: number): {
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

  async reviewWord(word: Word): Promise<void> {
    const newPriority = word.priority + 1;
    const { offsetExpr, isLearned } = this.getNextReviewSchedule(newPriority);

    await getDbInstance().runAsync(
      `UPDATE words
     SET next_review = datetime('now', ?),
         priority = ?,
         learned = ?
     WHERE id = ?;`,
      [offsetExpr, newPriority, isLearned, word.id]
    );
  }
}

export const wordService = new WordService();