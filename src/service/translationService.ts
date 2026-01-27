import { stringHelper } from "@/src/util/StringHelper";
import axios from "axios";
import { getDbInstance } from "../database/db";
import { NewTranslationDto } from "../dto/NewTranslationDto";
import { Language, Translation } from "../entity/types";
import { dateHelper } from "../util/DateHelper";

const MAX_TEXT_LENGTH = 20;
const TIMEOUT = 7000;

// 5000 chars per day free (for anonymous use)
const FREE_API_TRANSLATOR_URL = "https://api.mymemory.translated.net";

// 10_000 request per day (limit for each user by 10 requests per day)
const YANDEX_TRANSLATOR_URL = "https://dictionary.yandex.net/api/v1/dicservice.json";
const YANDEX_TRANSLATOR_API_KEY = process.env.EXPO_PUBLIC_YANDEX_API_KEY ?? "no_key_provided";


const freeApi = axios.create({
  baseURL: FREE_API_TRANSLATOR_URL,
  timeout: TIMEOUT,
});

const yandexApi = axios.create({
  baseURL: YANDEX_TRANSLATOR_URL,
  timeout: TIMEOUT,
});

export async function translateWord(text: string, language: Language): Promise<Translation> {
  const trimmedText = stringHelper.truncate(stringHelper.trimTextForSaving(text), MAX_TEXT_LENGTH);
  const translatedText = await translateWithYandexApi(trimmedText, language);
  const newTranslation = { text: trimmedText, text_language: language, translated_array: translatedText };
  return saveTranslation(newTranslation);
}

async function translateWithYandexApi(text: string, language: Language): Promise<string[]> {
  const toLanguage = language === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH;
  const params = {
    key: YANDEX_TRANSLATOR_API_KEY,
    lang: `${language}-${toLanguage}`,
    text,
  };
  return yandexApi
    .get("/lookup", { params })
    .then((response) => {
      const def = response.data.def[0];
      if (!def) {
        //todo: log and throw error
        return [];
      }
      return def.tr.map((tr: any) => stringHelper.truncate(tr.text, MAX_TEXT_LENGTH));
    })
    .catch(() => {
      console.error("Yandex translation API is not available");
      throw new Error("Unable to translate word");
    });
}

async function translateWithFreeApi(text: string, language: Language): Promise<string[]> {
  const toLanguage = language === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH;
  const params = {
    q: text,
    langpair: `${language}|${toLanguage}`,
  };
  return freeApi
    .get("/get", { params })
    .then((response) => {
      const translatedText = stringHelper.trimTextForSaving(response.data.responseData.translatedText);
      return [stringHelper.truncate(translatedText, MAX_TEXT_LENGTH)];
    })
    .catch(() => {
      console.error("Free translation API is not available");
      throw new Error("Unable to translate word");
    });
}

async function saveTranslation(newTranslation: NewTranslationDto): Promise<Translation> {
  const insertedRow = await getDbInstance().runAsync(
    `INSERT INTO translations (text, text_language, translated_array) VALUES (?, ?, ?)`,
    [newTranslation.text, newTranslation.text_language, JSON.stringify(newTranslation.translated_array)]
  );
  return {
    id: insertedRow.lastInsertRowId,
    text: newTranslation.text,
    text_language: newTranslation.text_language,
    translated_array: newTranslation.translated_array,
    translation_date: dateHelper.getCurrentDateTime(),
  };
}

export async function getTranslations(): Promise<Translation[]> {
  const translations = await getDbInstance().getAllAsync<any>(
    `SELECT id, text, text_language, translated_array, translation_date
    FROM translations
    ORDER BY translation_date DESC`
  );
  return translations.map((t) => ({
    id: t.id,
    text: t.text,
    text_language: t.text_language,
    translated_array: JSON.parse(t.translated_array),
    translation_date: t.translation_date,
  }));
}

export async function removeTranslation(translationToDeleteId: number): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations WHERE id = ?`, [translationToDeleteId]);
  return deletedRows.changes > 0;
}

export async function clearTranslations(): Promise<boolean> {
  const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations`);
  return deletedRows.changes > 0;
}
