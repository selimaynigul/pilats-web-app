import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageProvider";

export const UseLanguage = () => {
  return useContext(LanguageContext);
};

export default UseLanguage;
