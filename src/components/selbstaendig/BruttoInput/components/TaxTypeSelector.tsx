import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TaxTypeSelector.module.css';
import type { TaxTypeSelectorProps } from '../../../../types/components/selbstaendig/bruttoInput/components/taxTypeSelector';


const TaxTypeSelector: React.FC<TaxTypeSelectorProps> = ({ isMarried, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.splittingOption}>
            <div className={styles.taxTypeToggle}>
                <button
                    type="button"
                    aria-checked={!isMarried}
                    className={`${styles.taxTypeButton} ${!isMarried ? styles.active : ''}`}
                    onClick={() => onChange(false)}
                >
                    {t('Einzelveranlagung')}
                </button>
                <button
                    type="button"
                    aria-checked={isMarried}
                    className={`${styles.taxTypeButton} ${isMarried ? styles.active : ''}`}
                    onClick={() => onChange(true)}
                >
                    {t('Zusammenveranlagung (Splitting)')}
                </button>
            </div>
        </div>
    );
};

export default TaxTypeSelector;