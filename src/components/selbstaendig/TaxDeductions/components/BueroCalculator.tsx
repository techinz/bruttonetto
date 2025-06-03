import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BueroCalculator.module.css';
import WarningMessage from './WarningMessage';
import { parseNumber, round } from '../../../../utils';
import { CurrencyIcon, HomeIcon, OfficeIcon, ManualInputIcon, CalculatorIcon } from '../../../ui/icons';
import type { BueroCalculatorProps } from '../../../../types/components/selbstaendig/taxDeductions/bueroCalculator';
import { INPUTS_DATA } from '../../../../config/config';

/**
 * Allows users to calculate their office (work room) costs
 * based on either manual input or calculated values from the area
 *
 * @param {BueroCalculatorProps} props - The properties for the component
 */
const BueroCalculator: React.FC<BueroCalculatorProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const [animatePercent, setAnimatePercent] = useState(false);

  // percentage
  const calcPercent = () => {
    const { officeSqm, wholeSqm } = data;
    if (officeSqm > 0 && wholeSqm > 0) {
      return Math.min(100, round((officeSqm / wholeSqm) * 100, 1));
    }
    return 0;
  };

  // amount
  const calcBueroAmount = () => {
    const percent = calcPercent();
    const { warmmiete } = data;
    if (percent > 0 && warmmiete > 0) {
      return (warmmiete * percent) / 100;
    }
    return data.amount;
  };

  const bueroPercent = useMemo(() => calcPercent(), [data.officeSqm, data.wholeSqm]);
  const calculatedAmount = useMemo(() => calcBueroAmount(), [bueroPercent, data.warmmiete]);

  // mode toggle
  const handleModeToggle = (isCalculated: boolean) => {
    setAnimatePercent(true);
    onChange('isCalculated', isCalculated);
    setTimeout(() => setAnimatePercent(false), 500);
  };

  return (
    <div className={styles.bueroWrapper}>
      {/* mode selector tabs */}
      <div className={styles.modeTabs}>
        <button
          type="button"
          className={`${styles.modeTab} ${!data.isCalculated ? styles.active : ''}`}
          onClick={() => handleModeToggle(false)}
        >
          <ManualInputIcon width={24} height={24} />
          {t('Manuelle Eingabe')}
        </button>
        <button
          type="button"
          className={`${styles.modeTab} ${data.isCalculated ? styles.active : ''}`}
          onClick={() => handleModeToggle(true)}
        >
          <CalculatorIcon width={24} height={24} />
          {t('Mit Fläche berechnen')}
        </button>
      </div>

      <div className={styles.bueroContainer}>
        {!data.isCalculated ? (
          /* manual input mode */
          <div className={styles.manualInputCard}>
            <div className={styles.inputLabel}>{t('Bürokosten pro Monat')}</div>
            <div className={styles.amountInputWrapper}>
              <input
                type="number"
                min={INPUTS_DATA.taxDeductions.monthly.buero.amount.min}
                max={INPUTS_DATA.taxDeductions.monthly.buero.amount.max}
                step={INPUTS_DATA.taxDeductions.monthly.buero.amount.step}
                placeholder={t('Betrag eingeben')}
                value={data.amount.toString() || ''}
                onChange={e => onChange('amount', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.monthly.buero.amount.min, INPUTS_DATA.taxDeductions.monthly.buero.amount.max))}
                className={styles.amountInput}
              />
              <div className={styles.currencyBadge}>€</div>
            </div>
            <div className={styles.inputHint}>
              {t('Geben Sie die monatlichen Kosten für Ihr Büro/Arbeitszimmer ein.')}
            </div>
          </div>
        ) : (
          /* calculation mode */
          <div className={styles.calculationCard}>
            <div className={styles.inputSection}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <CurrencyIcon />
                  {t('Warmmiete')}
                </label>
                <div className={styles.inputWithUnit}>
                  <input
                    type="number"
                    min={INPUTS_DATA.taxDeductions.monthly.buero.warmmiete.min}
                    max={INPUTS_DATA.taxDeductions.monthly.buero.warmmiete.max}
                    step={INPUTS_DATA.taxDeductions.monthly.buero.warmmiete.step}
                    placeholder={t('Betrag eingeben')}
                    value={data.warmmiete.toString() || ''}
                    onChange={e => onChange('warmmiete', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.monthly.buero.warmmiete.min, INPUTS_DATA.taxDeductions.monthly.buero.warmmiete.max))}
                    className={styles.styledInput}
                  />
                  <span className={styles.unitBadge}>€</span>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <HomeIcon />
                    {t('Gesamtfläche')}
                  </label>
                  <div className={styles.inputWithUnit}>
                    <input
                      type="number"
                      min={INPUTS_DATA.taxDeductions.monthly.buero.wholeSqm.min}
                      max={INPUTS_DATA.taxDeductions.monthly.buero.wholeSqm.max}
                      step={INPUTS_DATA.taxDeductions.monthly.buero.wholeSqm.step}
                      placeholder={t('Fläche eingeben')}
                      value={data.wholeSqm.toString() || ''}
                      onChange={e => onChange('wholeSqm', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.monthly.buero.wholeSqm.min, INPUTS_DATA.taxDeductions.monthly.buero.wholeSqm.max))}
                      className={styles.styledInput}
                    />
                    <span className={styles.unitBadge}>m²</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <OfficeIcon />
                    {t('Bürofläche')}
                  </label>
                  <div className={styles.inputWithUnit}>
                    <input
                      type="number"
                      min={INPUTS_DATA.taxDeductions.monthly.buero.officeSqm.min}
                      max={INPUTS_DATA.taxDeductions.monthly.buero.officeSqm.max}
                      step={INPUTS_DATA.taxDeductions.monthly.buero.officeSqm.step}
                      placeholder={t('Fläche eingeben')}
                      value={data.officeSqm.toString() || ''}
                      onChange={e => onChange('officeSqm', parseNumber(e.target.value, INPUTS_DATA.taxDeductions.monthly.buero.officeSqm.min, INPUTS_DATA.taxDeductions.monthly.buero.officeSqm.max))}
                      className={styles.styledInput}
                    />
                    <span className={styles.unitBadge}>m²</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.resultSection}>
              <div className={styles.percentVisualizer}>
                <div
                  className={`${styles.percentGauge} ${animatePercent ? styles.animate : ''}`}
                  style={{ '--percent': `${bueroPercent}%` } as React.CSSProperties}
                >
                  <div className={styles.percentTrack}></div>
                  <div className={styles.percentFill}></div>
                  <div className={styles.percentLabel}>
                    <span className={styles.percentValue}>{bueroPercent}%</span>
                    <span className={styles.percentText}>{t('Anteil')}</span>
                  </div>
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultLabel}>{t('Monatlicher Abzug')}</div>
                <div className={styles.resultAmount}>
                  {round(calculatedAmount)} <span className={styles.currencySymbol}>€</span>
                </div>
                <div className={styles.resultFormula}>
                  {round(data.warmmiete)}€ × {bueroPercent}% = {round(calculatedAmount)}€
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {data.isCalculated && bueroPercent > 50 && (
        <WarningMessage message={t('Warnung: Bürofläche > 50%. Dies kann zu Rückfragen beim Finanzamt führen.')} />
      )}
      {data.isCalculated && data.officeSqm > data.wholeSqm && (
        <WarningMessage message={t('Bürofläche kann nicht größer als Gesamtfläche sein.')} />
      )}
    </div>
  );
};

export default BueroCalculator;