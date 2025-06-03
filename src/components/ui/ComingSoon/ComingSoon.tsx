import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ComingSoon.module.css';
import { ThemeContext } from '../../../context/ThemeContext';
import type { ComingSoonProps } from '../../../types/components/ui/comingSoon/comingSoon';

/**
 * Displays a message indicating that the feature is under development
 */
const ComingSoon: React.FC<ComingSoonProps> = ({ text }) => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);

    return (
        <div className={`${styles.container} ${styles[theme]}`}>
            <div className={styles.contentBox}>
                <h2 className={styles.title}>{t('Coming Soon')}</h2>
                <div className={styles.divider}></div>
                <p className={styles.message}>
                    {text}
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;