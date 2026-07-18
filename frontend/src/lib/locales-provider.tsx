"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, type LocaleType, type TranslationKeys } from "./locales";

type LocaleContextType = {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: TranslationKeys) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleType>("en");

  // Load preferred language from localStorage if available
  useEffect(() => {
    const savedLocale = localStorage.getItem("ksp_locale") as LocaleType;
    if (savedLocale === "en" || savedLocale === "kn") {
      queueMicrotask(() => {
        setLocaleState(savedLocale);
      });
    }
  }, []);

  const setLocale = (newLocale: LocaleType) => {
    setLocaleState(newLocale);
    localStorage.setItem("ksp_locale", newLocale);
  };

  const t = (key: TranslationKeys): string => {
    return translations[locale][key] || translations["en"][key] || String(key);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
