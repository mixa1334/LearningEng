import en from "@/assets/locales/en.json";
import ru from "@/assets/locales/ru.json";
import * as UserDataService from "@/src/service/userDataService";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const i18n = new I18n({ ru, en });
i18n.enableFallback = true;

export enum SupportedLocales {
  ENGLISH = "en",
  RUSSIAN = "ru",
}

interface LanguageContextType {
  locale: SupportedLocales;
  text: (key: string, options?: object) => string;
  changeLanguage: (newLocale: SupportedLocales) => void;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: SupportedLocales.ENGLISH,
  text: () => "",
  changeLanguage: () => { },
  isReady: false,
});

export const useLanguageContext = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { readonly children: React.ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocales>(SupportedLocales.ENGLISH);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedLang = await UserDataService.getUserLocale();
        const systemLocales = Localization.getLocales();
        const systemLanguage = systemLocales[0]?.languageCode;
        const isSupported = Object.values(SupportedLocales).includes(systemLanguage as SupportedLocales);
        const initialLocale = (savedLang || (isSupported ? systemLanguage : SupportedLocales.ENGLISH)) as SupportedLocales;
        i18n.locale = initialLocale;
        setLocale(initialLocale);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to load locale:", error);
        setIsReady(false);
      }
    })();
  }, []);

  const changeLanguage = useCallback((newLocale: SupportedLocales) => {
    if (locale === newLocale || !isReady) return;
    i18n.locale = newLocale;
    setLocale(newLocale);
    UserDataService.setUserLocale(newLocale);
  }, [isReady, locale]);

  const text = useCallback((key: string, options?: object) => {
    if (!isReady || !locale) return "error";
    return i18n.t(key, options);
  }, [isReady, locale]);

  const value = useMemo(
    () => ({
      locale,
      text,
      changeLanguage,
      isReady,
    }),
    [locale, changeLanguage, text, isReady]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
