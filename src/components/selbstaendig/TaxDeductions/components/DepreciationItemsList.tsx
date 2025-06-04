import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DepreciationItemsList.module.css';
import { PlusIcon } from '../../../ui/icons';
import { parseNumber } from '../../../../utils';
import { INPUTS_DATA } from '../../../../config/config';
import DeleteButton from '../../../ui/common/DeleteButton';
import type { DepreciationItemsListProps } from '../../../../types/components/selbstaendig/taxDeductions/depreciationItemsList';
import VatCheckbox from './VatCheckbox';


/**
 * Display a list of depreciation items
 * 
 * @param {Array<{ name: string, amount: number, purchaseDate: string, usefulLifeYears: number, method: string, degressiveRate?: number }>} items - The list of items to display
 * @param {boolean} isVatPayer - Whether the user is a VAT payer
 * @param {function} onAdd - Callback function to handle adding a new item
 * @param {function} onRemove - Callback function to handle removing an item
 * @param {function} onChange - Callback function to handle changes in the input fields
 */
const DepreciationItemsList: React.FC<DepreciationItemsListProps> = ({
    items,
    isVatPayer,
    onAdd,
    onRemove,
    onChange
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.depreciationList}>
            {items.map((item, index) => (
                <div key={index} className={styles.depreciationItem}>
                    <div className={styles.itemHeader}>
                        <input
                            type="text"
                            placeholder={t('Bezeichnung')}
                            value={item.name}
                            onChange={(e) => onChange(index, 'name', e.target.value)}
                            className={styles.nameInput}
                        />

                        <DeleteButton
                            onClick={() => onRemove(index)}
                            size="medium"
                        />
                    </div>

                    <div className={styles.itemDetails}>
                        <div className={styles.formGroup}>
                            <label>{t('Anschaffungskosten')}</label>
                            <div className={styles.inputWithUnit}>
                                <input
                                    type="number"
                                    min={INPUTS_DATA.taxDeductions.depreciationItemsList.amount.min}
                                    max={INPUTS_DATA.taxDeductions.depreciationItemsList.amount.max}
                                    step={INPUTS_DATA.taxDeductions.depreciationItemsList.amount.step}
                                    value={item.amount.toString() || ''}
                                    onChange={(e) => onChange(index, 'amount', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.depreciationItemsList.amount.min, INPUTS_DATA.taxDeductions.depreciationItemsList.amount.max))}
                                    className={styles.amountInput}
                                />
                                <span className={styles.unitSymbol}>€</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>{t('Kaufdatum')}</label>
                            <input
                                type="date"
                                value={item.purchaseDate || ''}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => onChange(index, 'purchaseDate', e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>{t('Nutzungsdauer')}</label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        min={INPUTS_DATA.taxDeductions.depreciationItemsList.usefulLifeYears.min}
                                        max={INPUTS_DATA.taxDeductions.depreciationItemsList.usefulLifeYears.max}
                                        step={INPUTS_DATA.taxDeductions.depreciationItemsList.usefulLifeYears.step}
                                        value={item.usefulLifeYears.toString() || ''}
                                        onChange={(e) => onChange(index, 'usefulLifeYears', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.depreciationItemsList.usefulLifeYears.min, INPUTS_DATA.taxDeductions.depreciationItemsList.usefulLifeYears.max))}
                                        className={styles.yearsInput}
                                    />
                                    <span className={styles.unitSymbol}>{t('Jahre')}</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>{t('Methode')}</label>
                                <select
                                    value={item.method || 'linear'}
                                    onChange={(e) => onChange(index, 'method', e.target.value)}
                                    className={styles.methodSelect}
                                >
                                    <option value="linear">{t('Linear')}</option>
                                    <option value="degressive">{t('Degressiv')}</option>
                                </select>
                            </div>
                        </div>

                        {item.method === 'degressive' && (
                            <div className={styles.formGroup}>
                                <label>{t('Degressiver Satz')}</label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        min={INPUTS_DATA.taxDeductions.depreciationItemsList.degressiveRatePercent.min}
                                        max={INPUTS_DATA.taxDeductions.depreciationItemsList.degressiveRatePercent.max}
                                        step={INPUTS_DATA.taxDeductions.depreciationItemsList.degressiveRatePercent.step}
                                        value={(item.degressiveRate?.toString() || '')}
                                        onChange={(e) => onChange(index, 'degressiveRate', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.depreciationItemsList.degressiveRatePercent.min, INPUTS_DATA.taxDeductions.depreciationItemsList.degressiveRatePercent.max))}
                                        className={styles.percentInput}
                                    />
                                    <span className={styles.unitSymbol}>%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* VAT checkbox, only visible for VAT payers */}
                    {isVatPayer && (
                        <VatCheckbox
                            checked={item.hasVat || false}
                            onChange={() => onChange(index, 'hasVat', !item.hasVat)}
                        />
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={onAdd}
                className={styles.addBtn}
            >
                <PlusIcon />
                {t('Gegenstand hinzufügen')}
            </button>
        </div>
    );
};

export default DepreciationItemsList;