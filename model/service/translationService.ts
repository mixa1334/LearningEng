import axios from "axios";
import { getDbInstance } from "../database/db";
import { NewTranslationDto } from "../dto/NewTranslationDto";
import { Language, Translation } from "../entity/types";
import { rowToTranslation } from "../mapper/typesMapper";

// 5000 chars per day free (for anonymous use)
const DEFAULT_TRANSLATOR_URL = "https://api.mymemory.translated.net";

const api = axios.create({
  baseURL: DEFAULT_TRANSLATOR_URL,
  timeout: 5000,
});

const translate = async (text: string, language: Language): Promise<string> => {
  const toLanguage = language === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH;
  const response = await api
    .get("/get", { params: { q: text, langpair: `${language}|${toLanguage}` } })
    .then((response) => response.data.responseData.translatedText)
    .catch((error) => {
      console.error(error);
      return "Unable to translate";
    });
  return response.length > 20 ? response.slice(0, 20) + "…" : response;
};

export async function translateAndSaveWord(text: string, language: Language): Promise<Translation> {
  const translatedText = await translate(text, language);
  const newTranslation =
    language === Language.ENGLISH ? { word_en: text, word_ru: translatedText } : { word_en: translatedText, word_ru: text };
  return saveTranslation(newTranslation);
}

export async function saveTranslation(newTranslation: NewTranslationDto): Promise<Translation> {
  const translationDate = new Date().toISOString();
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
  const rows = await getDbInstance().getAllAsync<any>(`SELECT * FROM translations ORDER BY translation_date DESC`);
  return rows.map(rowToTranslation);
}

export async function removeTranslation(translationToDelete: Translation): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations WHERE id = ?`, [translationToDelete.id]);
  return deletedRows.changes > 0;
}

export async function clearTranslations(): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations`);
  return deletedRows.changes > 0;
}
