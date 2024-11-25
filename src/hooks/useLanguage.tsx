import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageProvider";

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export default useLanguage;
