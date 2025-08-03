import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (keyObject) => {
    if (typeof keyObject === 'string') return keyObject; // للتعامل مع النصوص العادية
    return keyObject[language] || keyObject.en; // ارجع النص بناءً على اللغة
  };

  const isRTL = language === 'ar';

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};