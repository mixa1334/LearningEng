import { EntityType, type Word } from "@/model/entity/types";
import { getDbInstance } from "../database/db";
import { NewWordDto } from "../dto/NewWordDto";
import { rowToWord } from "../mapper/typesMapper";

const SELECT_WORDS = `SELECT
      w.id, w.word_en, w.word_ru, w.transcription, w.type, w.learned,
      w.next_review, w.priority, w.text_example, w.category_id,
      c.name AS category_name, c.type AS category_type, c.icon AS category_icon
    FROM words w
    JOIN categories c ON c.id = w.category_id
`;

const INSERT_WORD = `INSERT INTO words (word_en, word_ru, transcription, type, learned, category_id, next_review, priority, text_example) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export async function resetWordLearningProgress(): Promise<void> {
  await getDbInstance().runAsync("UPDATE words SET learned = 0, priority = 0");
}

export async function addNewWord(
  newWord: NewWordDto,
  wordType: EntityType = EntityType.useradd
): Promise<void> {
  const reviewDate = new Date().toISOString();
  await getDbInstance().runAsync(INSERT_WORD, [
    newWord.word_en,
    newWord.word_ru,
    newWord.transcription,
    wordType,
    +false,
    newWord.category_id,
    reviewDate,
    0,
    newWord.text_example,
  ]);
}

export async function deleteUserWord(wordToDelete: Word): Promise<void> {
  await getDbInstance().runAsync(
    `DELETE FROM words 
    WHERE type = 'user_added' AND id = ?`,
    [wordToDelete.id]
  );
}

export async function editUserWord(word: Word): Promise<void> {
  await getDbInstance().withExclusiveTransactionAsync(async (tx) => {
    const existingCategory = await tx.getFirstAsync<{ id: number }>(
      `SELECT id FROM categories WHERE id = ?;`,
      [word.category.id]
    );

    if (!existingCategory) {
      throw new Error(`Category with id ${word.category.id} does not exist`);
    }

    await tx.runAsync(
      `UPDATE words SET word_en = ?, word_ru = ?, transcription = ?, category_id = ?, text_example = ?
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
  });
}

export async function getUserWords(): Promise<Word[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `${SELECT_WORDS} WHERE w.type = 'user_added'`
  );
  return rows.map(rowToWord);
}

export async function getPreloadedWords(): Promise<Word[]> {
  const rows = await getDbInstance().getAllAsync<any>(
    `${SELECT_WORDS} WHERE w.type = 'pre_loaded'`
  );
  return rows.map(rowToWord);
}

export async function getDailyWordsToLearn(limit: number = 5): Promise<Word[]> {
  const rows = await getDbInstance().getAllAsync<any>(
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

export async function reviewWord(word: Word): Promise<void> {
  const newPriority = word.priority + 1;
  const days = newPriority + (newPriority - 1) * 2;
  let isLearned = +(newPriority > 50);

  await getDbInstance().runAsync(
    `UPDATE words
     SET next_review = datetime('now', ?),
         priority = ?,
         learned = ?
     WHERE id = ?;`,
    [`+${days} days`, newPriority, isLearned, word.id]
  );
}
