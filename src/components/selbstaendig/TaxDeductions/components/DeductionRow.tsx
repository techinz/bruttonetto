import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeductionRow.module.css';
import type { DeductionRowProps } from '../../../../types/components/selbstaendig/taxDeductions/deductionRow';
import { parseNumber } from '../../../../utils';
import DeleteButton from '../../../ui/common/DeleteButton';
import VatCheckbox from './VatCheckbox';

/**
 * Display a row of deduction information
 * 
 * @param {string} label - The label for the deduction
 * @param {number} amount - The amount of the deduction
 * @param {string} type - The type of deduction
 * @param {boolean} hasVat - Whether the expense is eligible for VAT deduction
 * @param {boolean} isVatPayer - Whether the user is a VAT payer
 * @param {Array<{ value: string, label: string }>} deductionTypes - List of deduction types
 * @param {function} onChange - Callback function to handle changes in the input fields
 * @param {function} onDelete - Callback function to handle deletion of the row
 * @param {React.ReactNode} children - Optional content to be rendered inside the row
 */
const DeductionRow: React.FC<DeductionRowProps> = ({
    label,
    min,
    max,
    step,
    amount,
    type,
    hasVat,
    isVatPayer,
    deductionTypes = [],
    onChange,
    onDelete,
    children
}) => {
    const { t } = useTranslation();
    console.log(hasVat)
    return (
        <div className={styles.row}>
            {!children ? (
                // standard input fields view
                <div className={styles.defaultRow}>
                    <div className={styles.nameField}>
                        <span className={styles.defaultLabel}>{t(label)}</span>
                    </div>

                    <div className={styles.amountField}>
                        <div className={styles.amountWrapper}>
                            <input
                                type="number"
                                min={min}
                                max={max}
                                step={step}
                                value={amount.toString()}
                                onChange={e => onChange({ amount: parseNumber(e.target.value, min, max), type, hasVat })}
                                className={styles.amountInput}
                            />
                            <span className={styles.currencySymbol}>€</span>
                        </div>
                    </div>

                    <div className={styles.typeField}>
                        {deductionTypes.length > 0 && (
                            <select
                                value={type}
                                onChange={e => onChange({ amount, type: e.target.value, hasVat })}
                                className={styles.typeSelect}
                            >
                                {deductionTypes.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* VAT checkbox, only visible for VAT payers */}
                    {isVatPayer && (
                        <VatCheckbox
                            checked={hasVat}
                            onChange={() => onChange({ amount, type, hasVat: !hasVat })}
                        />
                    )}

                    {onDelete && (
                        <div className={styles.actionField}>
                            <DeleteButton
                                onClick={onDelete}
                                size="medium"
                            />
                        </div>
                    )}
                </div>
            ) : (
                // complex components view
                <div className={styles.complexRow}>
                    <div className={styles.childrenContainer}>
                        <div className={styles.complexHeader}>
                            <h4 className={styles.defaultLabel}>{t(label)}</h4>
                        </div>
                        {children}

                        {/* VAT checkbox, only visible for VAT payers */}
                        {isVatPayer && (
                            <VatCheckbox
                                checked={hasVat || false}
                                onChange={() => onChange({ hasVat: !hasVat })}
                            />
                        )}
                    </div>

                    {onDelete && (
                        <div className={styles.complexActionField}>
                            <DeleteButton
                                onClick={onDelete}
                                size="medium"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DeductionRow;