import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeductionRow.module.css';
import type { CustomItemsListProps } from '../../../../types/components/selbstaendig/taxDeductions/customItemsList';
import { PlusIcon } from '../../../ui/icons';
import { parseNumber } from '../../../../utils';
import DeleteButton from '../../../ui/common/DeleteButton';

/**
 * A list of custom deduction items
 * 
 * @param {Array<{ name: string, amount: number, type?: string }>} items - The list of items to display
 * @param {function} onAdd - Callback function to handle adding a new item
 * @param {function} onRemove - Callback function to handle removing an item
 * @param {function} onChange - Callback function to handle changes in the input fields
 * @param {Array<{ value: string, label: string }>} deductionTypes - List of deduction types
 */
const CustomItemsList: React.FC<CustomItemsListProps> = ({
  items,
  min,
  max,
  step,
  onAdd,
  onRemove,
  onChange,
  deductionTypes = []
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.customList}>
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.defaultRow}>
            <div className={styles.nameField}>
              <input
                type="text"
                placeholder={t('Bezeichnung')}
                value={item.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                className={styles.nameInput}
              />
            </div>

            <div className={styles.amountField}>
              <div className={styles.amountWrapper}>
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  placeholder="0.00"
                  value={item.amount.toString() || ''}
                  onChange={(e) => onChange(index, 'amount', parseNumber(e.target.value, min, max))}
                  className={styles.amountInput}
                />
                <span className={styles.currencySymbol}>€</span>
              </div>
            </div>

            <div className={styles.typeField}>
              {deductionTypes.length > 0 && (
                <select
                  value={item.type || 'full'}
                  onChange={(e) => onChange(index, 'type', e.target.value)}
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

            <div className={styles.actionField}>
              <DeleteButton
                onClick={() => onRemove(index)}
                size="medium"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className={styles.addBtn}
      >
        <PlusIcon />
        {t('Abzug hinzufügen')}
      </button>
    </div>
  );
};

export default CustomItemsList;