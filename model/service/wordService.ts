import { EntityType, type Word } from "@/model/entity/types";
import {
  DELETE_WORD,
  INSERT_INTO_WORDS,
  SELECT_WORDS,
} from "@/resources/sql/wordsTable";
import type { SQLiteDatabase } from "expo-sqlite";
import { NewWordDto } from "../dto/NewWordDto";
import { rowToWord } from "../mapper/typesMapper";

export async function resetWordLearningProgress(
  db: SQLiteDatabase
): Promise<void> {
  await db.runAsync("UPDATE words SET learned = 0, priority = 0");
}

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

export async function deleteUserWord(
  db: SQLiteDatabase,
  wordToDelete: Word
): Promise<void> {
  await db.runAsync(
    `${DELETE_WORD} 
    WHERE type = 'user_added' AND id = ?`,
    [wordToDelete.id]
  );
}

//todo refactor add category check before update and wrap all in a single transaction
export async function editUserWord(
  db: SQLiteDatabase,
  word: Word
): Promise<void> {
  await db.runAsync(
    `UPDATE words
    SET word_en = ?, word_ru = ?, transcription = ?, category_id = ?, text_example = ?
    WHERE type = 'user_added' AND id = ?`,
    [
      word.word_en,
      word.word_ru,
      word.transcription,
      word.category.id,
      word.text_example,
      word.id,
    ]
  );
}

export async function getUserWords(db: SQLiteDatabase): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(
    `${SELECT_WORDS} WHERE w.type = 'user_added'`
  );
  return rows.map(rowToWord);
}

export async function getPreloadedWords(db: SQLiteDatabase): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(
    `${SELECT_WORDS} WHERE w.type = 'pre_loaded'`
  );
  return rows.map(rowToWord);
}

export async function getDailyWordsToLearn(
  db: SQLiteDatabase,
  limit: number = 5
): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(
    `${SELECT_WORDS}
    WHERE w.learned = 0
      AND w.priority = 0
    ORDER BY w.type DESC
    LIMIT ?`,
    [limit]
  );
  const ws = rows.map(rowToWord);
  return ws;
}

export async function getDailyWordsToReview(
  db: SQLiteDatabase
): Promise<Word[]> {
  const rows = await db.getAllAsync<any>(
    `${SELECT_WORDS}
    WHERE w.learned = 0
      AND datetime(w.next_review) <= datetime('now')
      AND w.priority > 0
    ORDER BY datetime(w.next_review) ASC;`
  );
  return rows.map(rowToWord);
}

export async function startLearningWord(
  db: SQLiteDatabase,
  word: Word
): Promise<void> {
  await db.runAsync(
    `UPDATE words
     SET priority = ?
     WHERE id = ?;`,
    [1, word.id]
  );
}

export async function markWordCompletelyLearned(
  db: SQLiteDatabase,
  word: Word
): Promise<void> {
  await db.runAsync(
    `UPDATE words
     SET learned = ?
     WHERE id = ?;`,
    [1, word.id]
  );
}

export async function reviewWord(
  db: SQLiteDatabase,
  word: Word
): Promise<void> {
  const newPriority = word.priority + 1;
  const days = newPriority + (newPriority - 1) * 2;
  let isLearned = +(newPriority > 50);

  await db.runAsync(
    `UPDATE words
     SET next_review = datetime('now', ?),
         priority = ?,
         learned = ?
     WHERE id = ?;`,
    [`+${days} days`, newPriority, isLearned, word.id]
  );
}
