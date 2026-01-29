import { stringHelper } from "@/src/util/stringHelper";
import axios, { AxiosInstance } from "axios";
import { getDbInstance } from "../database/db";
import { NewTranslationDto } from "../dto/NewTranslationDto";
import { Language, Translation, TranslatorEngine } from "../entity/types";
import { rowToTranslation } from "../mapper/typesMapper";
import { dateHelper } from "../util/dateHelper";


class TranslationService {
  private readonly MAX_TEXT_LENGTH = 20;
  private readonly TIMEOUT = 7000;
  private readonly FREE_API_TRANSLATOR_URL = "https://api.mymemory.translated.net";
  private readonly YANDEX_TRANSLATOR_URL = "https://dictionary.yandex.net/api/v1/dicservice.json";
  private readonly YANDEX_TRANSLATOR_API_KEY;

  private readonly freeApi: AxiosInstance;
  private readonly yandexApi: AxiosInstance;

  private translatorEngine: TranslatorEngine = TranslatorEngine.FREE_API;

  constructor() {
    const yandexApiKey = process.env.EXPO_PUBLIC_YANDEX_API_KEY;
    if (!yandexApiKey) {
      throw new Error("Yandex translator API key is not set");
    }
    this.YANDEX_TRANSLATOR_API_KEY = yandexApiKey;
    this.freeApi = axios.create({
      baseURL: this.FREE_API_TRANSLATOR_URL,
      timeout: this.TIMEOUT,
    });
    this.yandexApi = axios.create({
      baseURL: this.YANDEX_TRANSLATOR_URL,
      timeout: this.TIMEOUT,
    });
  }

  setTranslatorEngine(translatorEngine: TranslatorEngine) {
    this.translatorEngine = translatorEngine;
  }

  async translateWord(text: string, language: Language): Promise<Translation> {
    const trimmedText = stringHelper.truncate(stringHelper.trimTextForSaving(text), this.MAX_TEXT_LENGTH);
    let translatedText: string[];
    if (this.translatorEngine === TranslatorEngine.YANDEX_API) {
      translatedText = await this.translateWithYandexApi(trimmedText, language);
    } else {
      translatedText = await this.translateWithFreeApi(trimmedText, language);
    }
    const newTranslation = { text: trimmedText, text_language: language, translated_array: translatedText };
    return this.saveTranslation(newTranslation);
  }

  private async translateWithYandexApi(text: string, language: Language): Promise<string[]> {
    const toLanguage = language === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH;
    const params = {
      key: this.YANDEX_TRANSLATOR_API_KEY,
      lang: `${language}-${toLanguage}`,
      text,
    };
    return this.yandexApi
      .get("/lookup", { params })
      .then((response) => {
        const def = response.data.def[0];
        if (!def) {
          //todo: log and throw error
          return [];
        }
        return def.tr.map((tr: any) => stringHelper.truncate(tr.text, this.MAX_TEXT_LENGTH));
      })
      .catch(() => {
        console.error("Yandex translation API is not available");
        throw new Error("Unable to translate word");
      });
  }

  private async translateWithFreeApi(text: string, language: Language): Promise<string[]> {
    const toLanguage = language === Language.ENGLISH ? Language.RUSSIAN : Language.ENGLISH;
    const params = {
      q: text,
      langpair: `${language}|${toLanguage}`,
    };
    return this.freeApi
      .get("/get", { params })
      .then((response) => {
        const translatedText = stringHelper.trimTextForSaving(response.data.responseData.translatedText);
        return [stringHelper.truncate(translatedText, this.MAX_TEXT_LENGTH)];
      })
      .catch(() => {
        console.error("Free translation API is not available");
        throw new Error("Unable to translate word");
      });
  }

  private async saveTranslation(newTranslation: NewTranslationDto): Promise<Translation> {
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

  async getAllTranslations(): Promise<Translation[]> {
    const translations = await getDbInstance().getAllAsync<any>(
      `SELECT id, text, text_language, translated_array, translation_date
      FROM translations
      ORDER BY translation_date DESC`
    );
    return translations.map((t) => rowToTranslation(t));
  }

  async removeTranslation(id: number): Promise<boolean> {
    const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations WHERE id = ?`, [id]);
    return deletedRows.changes > 0;
  }

  async clearTranslations(): Promise<boolean> {
    const deletedRows = await getDbInstance().runAsync(`DELETE FROM translations`);
    return deletedRows.changes > 0;
  }
}

export const translationService = new TranslationService();