import { Language, THEMES, TranslatorEngine } from "../entity/types";
import * as DataStorageHelper from "../storage/userDataStorageHelper";
import { STORAGE_KEYS } from "../storage/userDataStorageHelper";

class SystemDataService {
    async getUserHapticsEnabled(): Promise<boolean> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.HAPTICS_ENABLED);
    }

    async setUserHapticsEnabled(hapticsEnabled: boolean): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.HAPTICS_ENABLED, hapticsEnabled);
    }

    async getUserSoundEnabled(): Promise<boolean> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.SOUND_ENABLED);
    }

    async setUserSoundEnabled(soundEnabled: boolean): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
    }

    async getUserLocale(): Promise<Language | undefined> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.LOCALE);
    }

    async setUserLocale(locale: Language): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.LOCALE, locale);
    }

    async getUserTheme(): Promise<THEMES> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.THEME);
    }

    async setUserTheme(theme: THEMES): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.THEME, theme);
    }

    async getTranslatorEngine(): Promise<TranslatorEngine> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.TRANSLATOR_ENGINE);
    }

    async setTranslatorEngine(translatorEngine: TranslatorEngine): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.TRANSLATOR_ENGINE, translatorEngine);
    }

    async getDeleteTranslationAfterAddingToVocabulary(): Promise<boolean> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.DELETE_TRANSLATION_AFTER_ADDING_TO_VOCABULARY);
    }

    async setDeleteTranslationAfterAddingToVocabulary(deleteTranslationAfterAddingToVocabulary: boolean): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.DELETE_TRANSLATION_AFTER_ADDING_TO_VOCABULARY, deleteTranslationAfterAddingToVocabulary);
    }

    async getClearTranslatorInputField(): Promise<boolean> {
        return DataStorageHelper.getUserProp(STORAGE_KEYS.CLEAR_TRANSLATOR_INPUT_FIELD);
    }

    async setClearTranslatorInputField(clearTranslatorInputField: boolean): Promise<void> {
        await DataStorageHelper.setUserProp(STORAGE_KEYS.CLEAR_TRANSLATOR_INPUT_FIELD, clearTranslatorInputField);
    }
}

export const systemDataService = new SystemDataService();