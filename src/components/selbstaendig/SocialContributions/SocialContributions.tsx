import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SocialContributions.module.css';
import { ThemeContext } from '../../../context/ThemeContext';
import { round, parseNumber, validateSocialContributionLimits, validateSocialContributionBrutto } from '../../../utils';
import type { ContributionType, SocialContributionItem, SocialContributionsData, SocialContributionsProps } from '../../../types/components/selbstaendig/socialContributions/socialContributions';
import { DEFAULT_SOCIAL_CONTRIBUTIONS, INPUTS_DATA } from '../../../config/config';
import BackButton from '../../ui/common/BackButton';
import { InfoIcon } from '../../ui/icons';


/**
 * Allows users to select and configure their social contribution payments,
 * including both mandatory (can be deleted/restored) and voluntary contributions
 * 
 * @param {Object} socialContributions - Current social contributions configuration
 * @param {number} brutto - Brutto (gross income) amount
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onBack - Callback to go to previous step
 */
const SocialContributions = ({ socialContributions, brutto, onSubmit, onBack }: SocialContributionsProps) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [localSocialContributions, setLocalSocialContributions] = useState<SocialContributionsData>(socialContributions);
  const [useReducedRate, setUseReducedRate] = useState(false);

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleReducedRateToggle = (contributionType: ContributionType, key: string) => {
    const newUseReducedRate = !useReducedRate;
    setUseReducedRate(newUseReducedRate);

    const standardPercent = DEFAULT_SOCIAL_CONTRIBUTIONS.voluntary.rentenversicherung.percent;
    const reducedPercent = DEFAULT_SOCIAL_CONTRIBUTIONS.voluntary.rentenversicherung.reducedPercentForFirst3Years ?? standardPercent;

    const percent = newUseReducedRate ? reducedPercent : standardPercent;

    handlePercentChange(contributionType, key, percent.toString());
  };

  const handleCheckboxChange = (contributionType: ContributionType, key: string) => {
    setLocalSocialContributions({
      // preserve existing contributions
      ...localSocialContributions,

      // update the specific contribution section
      [contributionType]: {
        // preserve existing contributions in this section
        ...localSocialContributions[contributionType],

        // update the specific contribution item
        [key]: {
          // preserve existing item properties
          ...localSocialContributions[contributionType][key],

          // toggle the checked state
          checked: !localSocialContributions[contributionType][key].checked
        }
      }
    });
  };

  const handlePercentChange = (contributionType: ContributionType, key: string, value: string) => {
    const isValidDecimal = /^\d*(\.\d*)?$/.test(value);

    const percent = parseNumber(value, INPUTS_DATA.socialContributions.percent.min, INPUTS_DATA.socialContributions.percent.max);

    const correctedBrutto = validateSocialContributionBrutto(localSocialContributions[contributionType][key], brutto)
    let amount = (percent / 100) * correctedBrutto
    amount = validateSocialContributionLimits(localSocialContributions[contributionType][key], amount);

    setLocalSocialContributions({
      // preserve existing contributions
      ...localSocialContributions,

      // update the specific contribution section
      [contributionType]: {
        // preserve existing contributions in this section
        ...localSocialContributions[contributionType],

        // update the specific contribution item
        [key]: {
          // preserve existing item properties
          ...localSocialContributions[contributionType][key],

          // update the percent and amount
          percent: isValidDecimal && value.endsWith(".") ? value : percent,
          amount: amount
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(localSocialContributions);
  };

  const renderContributionItems = (contributionType: ContributionType) => {
    return Object.entries(localSocialContributions[contributionType]).map(([key, item]: [string, SocialContributionItem]) => {
      const showInfoTag = (contributionType === 'voluntary' && key === 'rentenversicherung');

      const correctedBrutto = validateSocialContributionBrutto(item, brutto);

      let limitHint = null;
      let calculatedAmount = item.checked ? (item.percent / 100) * correctedBrutto : 0;

      const ceiling = item.ceiling;
      const minMonthly = item.minMonthly;
      const maxMonthly = item.maxMonthly;

      if (item.checked) {
        // adjust if above maximum monthly contribution or income exceeds ceiling
        if ((ceiling !== undefined && maxMonthly !== undefined) && (brutto > ceiling || calculatedAmount > maxMonthly)) {
          limitHint = (
            <div className={styles.limitHint}>
              <InfoIcon className={styles.infoIcon} width={18} height={18} />

              {
                brutto > ceiling ?
                  (<>
                    {t('Beitragsbemessungsgrenze: {{ceiling}}€', { ceiling })}
                    <br />
                  </>)
                  :
                  (<>{t('Maximalbeitrag: {{max}}€', { max: maxMonthly })}</>)
              }
            </div>
          );
        }

        // adjust if below minimum monthly contribution
        if (minMonthly !== undefined && (calculatedAmount < minMonthly && calculatedAmount > 0)) {
          limitHint = (
            <div className={styles.limitHint}>
              <InfoIcon className={styles.infoIcon} width={18} height={18} />
              <span>{t('Mindestbeitrag: {{min}}€', { min: minMonthly })}</span>
            </div>
          );
        }

        calculatedAmount = validateSocialContributionLimits(item, calculatedAmount);
      }

      return (
        <div className={styles.contributionItem} key={key}>
          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id={key}
              checked={item.checked}
              onChange={() => handleCheckboxChange(contributionType, key)}
              className={styles.checkbox}
            />
            <label htmlFor={key}>{t(item.label)}</label>
            {showInfoTag && (
              <span className={styles.infoTag}>{t('Für bestimmte Berufe verpflichtend')}</span>
            )}
          </div>

          {limitHint}


          <div className={styles.valueInputs}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*\.?[0-9]*"
              step={INPUTS_DATA.socialContributions.percent.step}
              min={INPUTS_DATA.socialContributions.percent.min}
              max={INPUTS_DATA.socialContributions.percent.max}
              value={item.percent.toString()}
              onChange={(e) => handlePercentChange(contributionType, key, e.target.value)}
              className={styles.percentInput}
              disabled={!item.checked}
            />
            <span className={styles.percentSymbol}>%</span>
            <span className={styles.equals}>=</span>
            <input
              type="text"
              value={item.checked ? round(item.amount) : '0.00'}
              className={styles.amountInput}
              disabled
            />
            <span className={styles.euroSymbol}>€</span>
          </div>

          {/* reduced rate hint */}
          {key === 'rentenversicherung' && item.checked && (
            <div className={styles.optionHint}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.optionCheckbox}
                  onChange={() => handleReducedRateToggle('voluntary', 'rentenversicherung')}
                  checked={useReducedRate}
                />
                {t('Reduzierter Satz für Neugründer (erste 3 Jahre)')}
              </label>
            </div>
          )}

        </div>
      );
    });
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.formHeader}>
        <BackButton onClick={onBack} />
        <h2 className={styles.title}>{t('Sozialabgaben')}</h2>
        <div className={styles.spacer}></div>
      </div>

      <p className={styles.subtitle}>
        {t('Brutto-Einkommen')}: <strong>{round(brutto)} €</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.contributionsSection}>
          <h3>{t('Pflichtbeiträge')}</h3>
          {renderContributionItems('mandatory')}
        </div>

        <div className={styles.contributionsSection}>
          <h3>{t('Optionale Beiträge')}</h3>
          {renderContributionItems('voluntary')}
        </div>

        <div className={styles.navigationButtons}>
          <button type="submit" className={styles.nextButton}>
            {t('Weiter')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialContributions;