export const WORDS_TABLE = "words";

export const COUNT_WORDS = `SELECT COUNT(*) as count FROM words;`;

export const INSERT_INTO_WORDS = `
    INSERT INTO words
    (word_en, word_ru, transcription, type, learned, category_id, next_review, priority, text_example)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;
