import axios from "axios";
import { getDbInstance } from "../database/db";
import { NewTranslationDto } from "../dto/NewTranslationDto";
import { Language, Translation } from "../entity/types";
import { getCurrentDateTime } from "../util/dateHelper";
import { trimTextForSaving } from "../util/stringHelper";

// 5000 chars per day free (for anonymous use)
const DEFAULT_TRANSLATOR_URL = "https://api.mymemory.translated.net";

const api = axios.create({
  baseURL: DEFAULT_TRANSLATOR_URL,
  timeout: 5000,
});

export async function translateWord(text: string, language: Language): Promise<Translation> {
  const trimmedText = trimTextForSaving(text);
  const translatedText = await translate(trimmedText, language);
  const newTranslation =
    language === Language.ENGLISH
      ? { word_en: trimmedText, word_ru: translatedText }
      : { word_en: translatedText, word_ru: trimmedText };
  return saveTranslation(newTranslation);
}

async function translate(text: string, language: Language): Promise<string> {
  const toLanguage = language === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH;
  return api
    .get("/get", { params: { q: text, langpair: `${language}|${toLanguage}` } })
    .then((response) => {
      const translatedText = response.data.responseData.translatedText;
      return translatedText.length > 20 ? translatedText.slice(0, 20) + "…" : translatedText;
    })
    .catch(() => {
      console.error("Translation API is not available");
      throw new Error("Unable to translate word");
    });
}

async function saveTranslation(newTranslation: NewTranslationDto): Promise<Translation> {
  const translationDate = getCurrentDateTime();
  const insertedRow = await getDbInstance().runAsync(
    `INSERT INTO translations (word_en, word_ru, translation_date) VALUES (?, ?, ?)`,
    [newTranslation.word_en, newTranslation.word_ru, translationDate]
  );
  return {
    id: insertedRow.lastInsertRowId,
    word_en: newTranslation.word_en,
    word_ru: newTranslation.word_ru,
    translation_date: translationDate,
  };
}

export async function getTranslations(): Promise<Translation[]> {
  return await getDbInstance().getAllAsync<Translation>(`SELECT * FROM translations ORDER BY translation_date DESC`);
}

export async function removeTranslation(translationToDeleteId: number): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations WHERE id = ?`, [translationToDeleteId]);
  return deletedRows.changes > 0;
}

export async function clearTranslations(): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations`);
  return deletedRows.changes > 0;
}
