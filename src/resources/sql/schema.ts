export const SCHEMA_CREATION_IF_NOT_EXISTS = `
    -- DROP TABLE IF EXISTS categories;
    -- DROP TABLE IF EXISTS words;
    -- DROP TABLE IF EXISTS translations;

    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      text_language TEXT NOT NULL CHECK (text_language IN ('en', 'ru')),
      translated_array TEXT NOT NULL CHECK (json_valid(translated_array)),
      translation_date TEXT NOT NULL DEFAULT (datetime('now'))
    );

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
      type TEXT NOT NULL CHECK (type IN ('pre_loaded', 'user_added')) DEFAULT 'pre_loaded',
      learned INTEGER NOT NULL DEFAULT 0,
      category_id INTEGER NOT NULL,
      next_review TEXT NOT NULL DEFAULT (datetime('now')),
      priority INTEGER NOT NULL DEFAULT 0,
      text_example TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `;
