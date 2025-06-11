
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLanguage, getCurrentLanguage, initializeLanguage } from '../utils/i18n';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  availableLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
    flag: string;
  }>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const availableLanguages = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' }
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('es');

  useEffect(() => {
    initializeLanguage();
    setCurrentLanguage(getCurrentLanguage());
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      availableLanguages
    }}>
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
