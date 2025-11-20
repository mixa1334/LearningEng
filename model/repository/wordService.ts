import { INSERT_INTO_WORDS, SELECT_WORD } from "@/constants/sql/wordsTable";
import { EntityType, type Word } from "@/model/entity/types";
import type { SQLiteDatabase } from "expo-sqlite";
import { rowToWord } from "../mapper/typesMapper";

type NewWordDto = {
  word_en: string;
  word_ru: string;
  transcription: string;
  category_id: number;
  text_example: string;
};

export async function addNewWord(
  db: SQLiteDatabase,
  newWord: NewWordDto,
  wordType: EntityType = EntityType.useradd
): Promise<void> {
  const reviewDate = new Date().toISOString();
  const insertionRow = [
    newWord.word_en,
    newWord.word_ru,
    newWord.transcription,
    wordType,
    +false,
    newWord.category_id,
    reviewDate,
    0,
    newWord.text_example,
  ];
  await db.runAsync(INSERT_INTO_WORDS, insertionRow);
}

export async function getDailyWordsToLearn(
  db: SQLiteDatabase,
  limit: number = 5
): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(
    `${SELECT_WORD}
    WHERE w.learned = 0
      AND datetime(w.next_review) <= datetime('now')
    ORDER BY datetime(w.next_review) ASC
    LIMIT ?;`,
    [limit]
  );
  return rows.map(rowToWord);
}

export async function startLearningWord(
  db: SQLiteDatabase,
  word: Word
): Promise<void> {}

export async function learnWord(db: SQLiteDatabase, word: Word): Promise<Word> {
  const newPriority = word.priority > 0 ? word.priority : 1;
  let isLearned = +(newPriority > 50);

  const result = await db.runAsync(
    `UPDATE words
     SET next_review = datetime('now', ?),
         priority = ?,
         learned = ?
     WHERE id = ?;`,
    [`+${days} days`, newPriority, isLearned, word.id]
  );
  return;
}
