import React, { useState, createContext, useContext, ReactNode } from "react";

import { languageOptions, dictionaryList } from "../locales";

interface LanguageContextProps {
  userLanguage: any;
  dictionary: Record<any, any>;
  userLanguageChange: () => void;
}

// create the language context with default selected language
export const LanguageContext = createContext<LanguageContextProps>({
  userLanguage: "en",
  dictionary: dictionaryList.en,
  userLanguageChange: () => {},
});

// it provides the language context to app
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const defaultLanguage = window.localStorage.getItem("rcml-lang");
  const [userLanguage, setUserLanguage] = useState<string>(
    defaultLanguage || "en"
  );

  const provider: LanguageContextProps = {
    userLanguage,
    dictionary: dictionaryList[userLanguage as keyof typeof dictionaryList],
    userLanguageChange: () => {
      const newLanguage = userLanguage === "en" ? "tr" : "en";
      setUserLanguage(newLanguage);
      window.localStorage.setItem("rcml-lang", newLanguage);
    },
  };

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
}

// get text according to id & current language
interface TextProps {
  tid: string;
}

export function Text({ tid }: TextProps) {
  const languageContext = useContext(LanguageContext);

  return languageContext.dictionary[tid] || tid;
}
