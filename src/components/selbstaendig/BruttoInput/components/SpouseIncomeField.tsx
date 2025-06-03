import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SpouseIncomeField.module.css';
import type { SpouseIncomeFieldProps } from '../../../../types/components/selbstaendig/bruttoInput/components/spouseIncomeField';


const SpouseIncomeField: React.FC<SpouseIncomeFieldProps> = ({
    value, onChange, min, max, step
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.spouseIncomeSection}>
            <label htmlFor="spouseIncome">{t('Einkommen Ehepartner:in')}</label>
            <div className={styles.inputGroup}>
                <input
                    id="spouseIncome"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={min.toString()}
                />
                <span className={styles.currency}>€</span>
                <div className={styles.inputHint}>
                    {t('Monatliches Bruttoeinkommen des Ehepartners')}
                </div>
            </div>
        </div>
    );
};

export default SpouseIncomeField;