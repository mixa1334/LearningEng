import { Language } from "../entity/types";

export type NewTranslationDto = {
  text: string;
  text_language: Language;
  translated_array: string[];
};