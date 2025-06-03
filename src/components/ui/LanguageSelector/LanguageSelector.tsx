import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './LanguageSelector.module.css';
import { LANGUAGES } from '../../../config/config';

/**
 * Displays flag buttons for switching between languages
 */
const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={styles.languageSelector}>
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    className={language === lang.code ? styles.active : ''}
                    onClick={() => setLanguage(lang.code)}
                    aria-label={lang.title}
                    title={lang.title}
                >
                    <img src={lang.flag} alt={lang.alt} className={styles.flag} />
                </button>
            ))}
        </div>
    );
};

export default LanguageSelector;