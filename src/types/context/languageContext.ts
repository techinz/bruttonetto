export type Language = 'de' | 'en' | 'ru' | 'uk';

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};
