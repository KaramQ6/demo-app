// src/contexts/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (translations) => {
    // إذا كان المدخل نصًا عاديًا، أرجعه كما هو
    if (typeof translations === 'string') {
      return translations;
    }
    // إذا كان كائنًا، أرجع الترجمة الصحيحة، أو الإنجليزية كخيار افتراضي
    if (typeof translations === 'object' && translations !== null) {
      return translations[language] || translations['en'];
    }
    // في أي حالة أخرى، أرجع نصًا فارغًا لمنع الأخطاء
    return '';
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  const value = {
    language,
    setLanguage,
    isRTL: language === 'ar',
    t,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};