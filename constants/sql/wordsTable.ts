export const WORDS_TABLE = "words";

export const COUNT_WORDS = `SELECT COUNT(*) as count FROM words;`;

export const INSERT_INTO_WORDS = `
    INSERT INTO words
    (word_en, word_ru, transcription, type, learned, category_id, next_review, priority, text_example)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const SELECT_WORD = `SELECT
      w.id, w.word_en, w.word_ru, w.transcription, w.type, w.learned,
      w.next_review, w.priority, w.text_example, w.category_id,
      c.name AS category_name, c.type AS category_type, c.icon AS category_icon
    FROM words w
    JOIN categories c ON c.id = w.category_id`;
