import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BruttoInputField.module.css';
import type { BruttoInputFieldProps } from '../../../../types/components/selbstaendig/bruttoInput/components/bruttoInputField';


const BruttoInputField = forwardRef<HTMLInputElement, BruttoInputFieldProps>(
    ({ value, onChange, min, max, step }, ref) => {
        const { t } = useTranslation();

        return (
            <div className={styles.inputContainer}>
                <input
                    ref={ref}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={onChange}
                    className={styles.bruttoInput}
                    placeholder={min.toString()}
                    aria-required="true"
                    aria-label={t('Monatliches Brutto-Einkommen')}
                />
                <div className={styles.euroSymbol}>€</div>
            </div>
        );
    }
);

BruttoInputField.displayName = 'BruttoInputField';

export default BruttoInputField;