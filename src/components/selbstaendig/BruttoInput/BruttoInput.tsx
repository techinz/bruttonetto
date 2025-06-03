import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BruttoInput.module.css';
import { ThemeContext } from '../../../context/ThemeContext';
import type { BruttoInputProps } from '../../../types/components/selbstaendig/bruttoInput/bruttoInput';
import { parseNumber } from '../../../utils';
import { INPUTS_DATA } from '../../../config/config';

import TaxTypeSelector from './components/TaxTypeSelector';
import BruttoInputField from './components/BruttoInputField';
import SpouseIncomeField from './components/SpouseIncomeField';


/** Allows users to input their gross income and marital status
  * 
  */
const BruttoInput: React.FC<BruttoInputProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [value, setValue] = useState<string>('');
  const [isMarried, setIsMarried] = useState<boolean>(false);
  const [spouseIncome, setSpouseIncome] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // auto focus the input field and smooth scroll to form on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const timer = setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isFormValid = useMemo(() => {
    return value && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
  }, [value]);

  const handleBruttoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseNumber(
      e.target.value,
      INPUTS_DATA.bruttoInput.brutto.min,
      INPUTS_DATA.bruttoInput.brutto.max
    ).toString();
    setValue(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericValue = parseFloat(value);
    if (isFormValid) {
      onSubmit(numericValue, isMarried, parseInt(spouseIncome || '0'));
    }
  };

  return (
    <form
      ref={formRef}
      className={`${styles.bruttoForm} ${styles[theme]}`}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title}>{t('Monatliches Brutto-Einkommen')}</h2>

      <TaxTypeSelector
        isMarried={isMarried}
        onChange={setIsMarried}
      />

      <div className={styles.inputWrapper}>
        <BruttoInputField
          value={value}
          onChange={handleBruttoChange}
          min={INPUTS_DATA.bruttoInput.brutto.min}
          max={INPUTS_DATA.bruttoInput.brutto.max}
          step={INPUTS_DATA.bruttoInput.brutto.step}
          ref={inputRef}
        />

        <div className={styles.splittingOption}>
          {isMarried && (
            <SpouseIncomeField
              value={spouseIncome}
              onChange={(e) => setSpouseIncome(parseNumber(
                e.target.value,
                INPUTS_DATA.bruttoInput.spouseIncome.min,
                INPUTS_DATA.bruttoInput.spouseIncome.max
              ).toString())}
              min={INPUTS_DATA.bruttoInput.spouseIncome.min}
              max={INPUTS_DATA.bruttoInput.spouseIncome.max}
              step={INPUTS_DATA.bruttoInput.spouseIncome.step}
            />
          )}
        </div>
      </div>

      <button
        type="submit"
        className={styles.nextButton}
        disabled={!isFormValid}
      >
        {t('Weiter')}
      </button>
    </form>
  );
};

export default BruttoInput;