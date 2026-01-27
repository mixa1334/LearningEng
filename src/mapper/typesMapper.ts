import { Category, Translation, Word } from "../entity/types";

export function rowToWord(row: any): Word {
  return {
    id: row.id,
    word_en: row.word_en,
    word_ru: row.word_ru,
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

export function rowToTranslation(row: any): Translation {
  return {
    id: row.id,
    text: row.text,
    text_language: row.text_language,
    translated_array: JSON.parse(row.translated_array),
    translation_date: row.translation_date,
  };
}