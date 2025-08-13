import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import {storageService} from '@/services/storageService';
import {STORAGE_KEYS, APP_CONFIG} from '@/config/constants';

// Import translation resources
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

interface I18nContextType {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => Promise<void>;
  t: (key: string, options?: any) => string;
  loading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {translation: en},
    ar: {translation: ar},
  },
  lng: APP_CONFIG.DEFAULT_LANGUAGE,
  fallbackLng: APP_CONFIG.DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const I18nProvider: React.FC<I18nProviderProps> = ({children}) => {
  const [language, setLanguage] = useState(APP_CONFIG.DEFAULT_LANGUAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      // Get stored language preference
      const storedLanguage = await storageService.getItem(STORAGE_KEYS.LANGUAGE);
      const selectedLanguage = storedLanguage || APP_CONFIG.DEFAULT_LANGUAGE;
      
      await changeLanguage(selectedLanguage);
      setLoading(false);
    } catch (error) {
      console.error('Language initialization error:', error);
      setLoading(false);
    }
  };

  const changeLanguage = async (lang: string) => {
    try {
      if (!APP_CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
        console.warn(`Language ${lang} is not supported, falling back to ${APP_CONFIG.DEFAULT_LANGUAGE}`);
        lang = APP_CONFIG.DEFAULT_LANGUAGE;
      }

      // Check if RTL change is needed
      const newIsRTL = APP_CONFIG.RTL_LANGUAGES.includes(lang);
      const currentIsRTL = I18nManager.isRTL;

      // Change i18n language
      await i18n.changeLanguage(lang);
      
      // Update local state
      setLanguage(lang);
      
      // Store language preference
      await storageService.setItem(STORAGE_KEYS.LANGUAGE, lang);
      
      // Handle RTL layout change if needed
      if (newIsRTL !== currentIsRTL) {
        I18nManager.allowRTL(newIsRTL);
        I18nManager.forceRTL(newIsRTL);
        
        // Note: In a real app, you might want to show a restart prompt here
        // as RTL changes require app restart to take full effect
        console.warn('RTL layout changed. App restart recommended for full effect.');
      }
      
    } catch (error) {
      console.error('Language change error:', error);
      throw error;
    }
  };

  const isRTL = APP_CONFIG.RTL_LANGUAGES.includes(language);

  const contextValue: I18nContextType = {
    language,
    isRTL,
    changeLanguage,
    t: i18n.t,
    loading,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Export i18n instance for use outside of React components
export {i18n};