import { Category, Word } from "../entity/types";

export function rowToWord(row: any): Word {
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

export function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
  };
}
