import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('farmer_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('farmer_lang', nextLang);
  };

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'hi') {
      setLang(newLang);
      localStorage.setItem('farmer_lang', newLang);
    }
  };

  const t = (key) => {
    const currentDict = translations[lang] || translations.en;
    return currentDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
