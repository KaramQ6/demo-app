import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [direction, setDirection] = useState('rtl');

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Update body class for styling
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.className += ` ${direction}`;
  }, [language, direction]);

  const toggleLanguage = () => {
    if (language === 'ar') {
      setLanguage('en');
      setDirection('ltr');
    } else {
      setLanguage('ar');
      setDirection('rtl');
    }
  };

  const t = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj.en || textObj.ar || '';
  };

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      toggleLanguage,
      t,
      isRTL: direction === 'rtl'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};