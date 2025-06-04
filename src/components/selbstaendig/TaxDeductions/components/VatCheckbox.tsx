import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VatCheckbox.module.css';
import type { VatCheckboxProps } from '../../../../types/components/selbstaendig/taxDeductions/vatCheckbox';


/**
 * VAT checkbox component to indicate whether the item uses VAT
 * 
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {function} onChange - Callback when checkbox state changes
 */
const VatCheckbox: React.FC<VatCheckboxProps> = ({
    checked,
    onChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.vatField}>
            <label className={styles.vatCheckboxLabel}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className={styles.vatCheckbox}
                />
                <span className={styles.vatCheckboxText}>{t('USt.')}</span>
            </label>
        </div>
    );
};

export default VatCheckbox;