import React, { createContext, useContext, useMemo, useState } from "react";
import * as Localization from "expo-localization";
import { Lang, t as translate } from "./translations";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (text: string) => string };

const LanguageContext = createContext<Ctx | null>(null);

function detectDefaultLang(): Lang {
  try {
    const tag = Localization.getLocales()[0]?.languageCode;
    return tag === "ur" ? "ur" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectDefaultLang());
  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (text: string) => translate(lang, text) }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage() must be used inside <LanguageProvider>");
  return ctx;
}
