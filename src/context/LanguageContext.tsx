import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n/i18n';
import { useNavigate } from 'react-router-dom';
import { INITIAL_LANGUAGE, LANGUAGES, metaTags } from '../config/config';
import type { Language, LanguageContextType } from '../types/context/languageContext';

const LanguageContext = createContext<LanguageContextType>({
  language: 'de',
  setLanguage: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();

  function detectUserLanguage(): Language {
    const browserLanguages = navigator.languages || [navigator.language];
    const preferredLanguages = browserLanguages.map(lang => lang.split('-')[0]);  // extract the language code ("en-US" = "en")
    const supportedLanguages = LANGUAGES.map(lang => lang.code as Language);

    for (const lang of preferredLanguages) {
      if (supportedLanguages.includes(lang as Language)) {
        return lang as Language;
      }
    }

    return INITIAL_LANGUAGE; // fallback
  }

  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && LANGUAGES.some(lang => lang.code === savedLanguage)) {
      return savedLanguage as Language;
    }

    return detectUserLanguage();
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    i18n.changeLanguage(lang);

    navigate('/', { replace: true });

    updateMetaTags(lang);
  };

  // apply language from local storage on mount
  useEffect(() => {
    setLanguage(language)
  }, []);

  function updateMetaTags(lang: Language) {
    if (!metaTags[lang]) {
      lang = INITIAL_LANGUAGE;
    }

    // document meta tags
    document.title = metaTags[lang].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metaTags[lang].description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', metaTags[lang].keywords);

    // openGraph tags
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', metaTags[lang].ogTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metaTags[lang].ogDescription);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', metaTags[lang].ogLocale);

    // twitter tags
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', metaTags[lang].twitterTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', metaTags[lang].twitterDescription);

    // update structured data if available
    const structuredDataElement = document.querySelector('script[type="application/ld+json"]');
    if (structuredDataElement) {
      try {
        const data = JSON.parse(structuredDataElement.textContent || '{}');
        data.name = metaTags[lang].structuredData.name;
        data.description = metaTags[lang].structuredData.description;
        structuredDataElement.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        console.error('Error updating structured data:', e);
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};