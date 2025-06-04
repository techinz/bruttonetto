import { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ResultDisplay.module.css';
import { ThemeContext } from '../../../context/ThemeContext';
import { round } from '../../../utils';
import type { ResultDisplayProps } from '../../../types/components/selbstaendig/resultDisplay/resultDisplay';
import { calculateSingleTax } from '../../../services/calculatorService';
import ExportPdfButton from './ExportPdfButton';
import { RestartIcon, LongArrow } from '../../ui/icons';


/**
 * Displays the final calculation results
 * 
 * @param {CalculationResults} results - The calculation results object
 * @param {number} brutto - Brutto (gross income) amount
 * @param {Function} onBackToStart - Handler to restart calculations
 * @param {Function} onBack - Handler to go back to the previous step
 */
const ResultDisplay = ({ results, brutto, isMarried, spouseIncome = 0, socialContributions, taxDeductions, onBackToStart }: ResultDisplayProps) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const [showDetails, setShowDetails] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const {
    monthlyLoss,
    yearlyLoss,
    percentLoss,
    nettoPercentage
  } = useMemo(() => {
    let monthlyLoss = brutto - results.netto;
    let yearlyLoss = monthlyLoss * 12;
    let percentLoss = (monthlyLoss / brutto) * 100;
    let nettoPercentage = 100 - percentLoss;

    return { monthlyLoss, yearlyLoss, percentLoss, nettoPercentage };
  }, [brutto, results.netto]);

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className={`${styles.resultBox} ${styles[theme]}`} ref={resultRef}>
      <h2>{t('Ergebnis')}</h2>

      {/* income comparison */}
      <div className={styles.incomeComparisonContainer}>
        {/* brutto income */}
        <div className={styles.bruttoContainer}>
          <span className={styles.incomeLabel}>{t('Brutto')}</span>
          <span className={styles.bruttoAmount}>
            {round(brutto)} €
            {results.isVatPayer && (
              <span className={styles.vatAddition}>
                + {round(results.outputVat / 12)} € {t('USt.')}
              </span>
            )}
          </span>
          <span className={styles.periodLabel}>{t('monatlich')}</span>
        </div>

        {/* flow indicator */}
        <div className={styles.flowIndicator}>
          <div className={styles.arrowsContainer}>
            <LongArrow width={48} height={48} className={styles.arrow} />
          </div>
          <div className={styles.lossIndicator}>
            <span className={styles.lossAmount}>-{round(monthlyLoss)} €</span>
            <span className={styles.lossPercent}>(-{round(percentLoss, 1)}%)</span>
          </div>
        </div>

        {/* netto income */}
        <div className={styles.nettoContainer}>
          <span className={styles.incomeLabel}>{t('Netto')}</span>
          <span className={styles.nettoAmount}>
            {round(results.netto, 0)} €
            {results.isVatPayer && (
              <span className={`${styles.vatAddition} ${results.vatToPay > 0 ? styles.vatPayment : styles.vatRefund}`}>
                + {round(Math.abs(results.vatToPay / 12), 0)} € {t('USt.')}
                <span className={styles.vatLabel}>
                  {results.vatToPay > 0
                    ? t('zu zahlen')
                    : t('Erstattung')}
                </span>
              </span>
            )}
          </span>
          <span className={styles.periodLabel}>{t('monatlich')}</span>
        </div>
      </div>

      {/* percentage bar */}
      <div className={styles.percentageBar}>
        <div
          className={styles.nettoPercentage}
          style={{ width: `${nettoPercentage}%` }}
        >
          <span>{round(nettoPercentage, 1)}%</span>
        </div>
        <div
          className={styles.lossPercentage}
          style={{ width: `${percentLoss}%` }}
        >
          <span>{round(percentLoss, 1)}%</span>
        </div>
      </div>

      {/* yearly summary */}
      <div className={styles.yearlySummary}>
        <div className={styles.yearlyItem}>
          <span>{t('Jährlich Brutto')}</span>
          <strong className={styles.bruttoYearly}>{round(brutto * 12)} €</strong>
        </div>
        <div className={styles.yearlyItem}>
          <span>{t('Jährlich Netto')}</span>
          <strong className={styles.nettoYearly}>{round(results.netto * 12)} €</strong>
        </div>
        <div className={styles.yearlyItem}>
          <span>{t('Jährlicher Verlust')}</span>
          <strong className={styles.lossYearly}>-{round(yearlyLoss)} €</strong>
        </div>
      </div>

      {/* details */}
      <button
        className={`${styles.detailsBtn} ${showDetails ? styles.active : ''}`}
        onClick={() => setShowDetails(d => !d)}
      >
        {showDetails ? t('Details ausblenden') : t('Details anzeigen')}
        <LongArrow
          className={`${styles.detailsArrow} ${showDetails ? styles.rotated : ''}`}
          width={16}
          height={16}
        />
      </button>

      {showDetails && (
        <div className={styles.details}>
          <div>
            <span>{t('Nach Sozialabgaben')}:</span>
            <strong>{round(results.afterSocialContributions)} €</strong>
          </div>
          <div>
            <span>{t('Zu versteuerndes Einkommen')}:</span>
            <strong>{round(results.taxableIncome)} €</strong>
          </div>
          <div className={styles.taxDetailRow}>
            <span>{t('Steuer')}:</span>
            <div className={styles.taxDetails}>
              <div className={styles.taxValue}>
                <strong>{round(results.steuer)} €</strong>
                <span className={styles.taxPeriod}>{t('monatlich')}</span>
              </div>
              <div className={styles.taxValue}>
                <strong>{round(results.steuer * 12)} €</strong>
                <span className={styles.taxPeriod}>{t('jährlich')}</span>
              </div>
            </div>
          </div>

          {/* VAT section (only for VAT payers) */}
          {results.isVatPayer && (
            <div className={styles.vatDetailRow}>
              <span>
                {results.vatToPay > 0
                  ? t('Zu zahlende Umsatzsteuer')
                  : results.vatToPay < 0
                    ? t('Umsatzsteuer-Erstattung')
                    : t('Umsatzsteuer')} ({results.vatPercent}%):
              </span>
              <div className={styles.taxDetails}>
                <div className={styles.taxValue}>
                  <strong className={results.vatToPay > 0 ? styles.positive : results.vatToPay < 0 ? styles.negative : ''}>
                    {results.vatToPay > 0 ? '' : '-'}{round(Math.abs(results.vatToPay / 12))} €
                  </strong>
                  <span className={styles.taxPeriod}>{t('monatlich')}</span>
                </div>
                <div className={styles.taxValue}>
                  <strong className={results.vatToPay > 0 ? styles.positive : results.vatToPay < 0 ? styles.negative : ''}>
                    {results.vatToPay > 0 ? '' : '-'}{round(Math.abs(results.vatToPay))} €
                  </strong>
                  <span className={styles.taxPeriod}>{t('jährlich')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.navigationButtons}>
        <ExportPdfButton
          results={results}
          brutto={brutto}
          isMarried={isMarried}
          spouseIncome={spouseIncome}
          socialContributions={socialContributions}
          taxDeductions={taxDeductions}
          taxSavings={isMarried ? {
            individualTax: round(calculateSingleTax(brutto * 12) / 12 + calculateSingleTax(spouseIncome * 12) / 12),
            splittingTax: round(results.steuer),
            savings: round(calculateSingleTax(brutto * 12) / 12 + calculateSingleTax(spouseIncome * 12) / 12 - results.steuer)
          } : null}
        />
        <button className={styles.restartBtn} onClick={onBackToStart}>
          <RestartIcon width={28} height={28} />
          {t('Neu berechnen')}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;