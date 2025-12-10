import { Category } from "../entity/types";

export type UpdateWordDto = {
  id: number;
  word_en: string;
  word_ru: string;
  transcription: string;
  category: Category;
  text_example: string;
};