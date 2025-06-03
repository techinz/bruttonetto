import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TaxDeductions.module.css';
import { ThemeContext } from '../../../context/ThemeContext';
import { InfoIcon } from '../../ui/icons';
import DeductionsSection from './components/DeductionsSection';
import DeductionRow from './components/DeductionRow';
import BueroCalculator from './components/BueroCalculator';
import CustomItemsList from './components/CustomItemsList';
import ExplanationBox from './components/ExplanationBox';
import type { BueroData, CustomDeduction, Deductions, DeductionSection, DeletedDeductions, TaxDeductionsProps } from '../../../types/components/selbstaendig/taxDeductions/taxDeductions';
import { DEDUCTION_TYPES, INPUTS_DATA } from '../../../config/config';
import DepreciationItemsList from './components/DepreciationItemsList';
import { parseNumber } from '../../../utils';
import BackButton from '../../ui/common/BackButton';
import RestoreButton from '../../ui/common/RestoreButton';

/**
 * Configure tax deductions, including monthly and one time deductions.
 * Can add custom, modify existing, and delete/restore default deductions
 * 
 * @param {Object} deductions - Current deductions configuration
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onBack - Callback to go to previous step
 */
const TaxDeductions: React.FC<TaxDeductionsProps> = ({
  deductions,
  onSubmit,
  onBack,
}) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [local, setLocal] = useState<Deductions>(deductions);
  const [deletedDeductions, setDeletedDeductions] = useState<DeletedDeductions>({
    monthly: {},
    oneTime: {},
    depreciation: {}
  });

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleChange = (section: DeductionSection, field: string, value: any) => {
    setLocal(prev => ({
      // preserve other sections
      ...prev,

      // update target section
      [section]: {
        // preserve other fields in the section
        ...prev[section],

        // update target field
        [field]: value
      }
    }));
  };

  const handleBueroChange = (field: keyof BueroData, value: number | boolean) => {
    setLocal(prev => ({
      // preserve other sections
      ...prev,

      // update monthly section
      monthly: {
        // preserve other fields in monthly
        ...prev.monthly,

        // update buero field
        buero: {
          // preserve other fields in buero
          ...prev.monthly.buero,

          // update target field
          [field]: value
        }
      }
    }));
  };

  const handleCustomChange = (section: DeductionSection, index: number, field: keyof CustomDeduction, value: string | number) => {
    setLocal(prev => {
      // create a copy of the custom deductions array
      const updated = [...prev[section].custom];

      // update the specific item
      updated[index] = {
        // preserve other fields
        ...updated[index],

        // update target field
        [field]: value
      };

      return {
        // preserve other sections
        ...prev,

        // update target section
        [section]: {
          // preserve other fields in the section
          ...prev[section],

          // update custom deductions with the modified data
          custom: updated
        }
      };
    });
  };

  const addCustom = (section: DeductionSection) => {
    setLocal(prev => ({
      // preserve other sections
      ...prev,

      // update target section
      [section]: {
        // preserve other fields in the section
        ...prev[section],

        // add a new custom deduction
        custom: [...prev[section].custom, { name: '', amount: 0, type: 'full' }]
      }
    }));
  };

  const removeCustom = (section: DeductionSection, index: number) => {
    setLocal(prev => {
      // filter out the item at the specified index
      const updated = prev[section].custom.filter((_, i) => i !== index);

      return {
        // preserve other sections
        ...prev,

        // update target section
        [section]: {
          // preserve other fields in the section
          ...prev[section],

          // update custom deductions with data without the item
          custom: updated
        }
      };
    });
  };

  const handleDeleteDefaultDeduction = (section: DeductionSection, field: string) => {
    setDeletedDeductions(prev => ({
      // preserve other sections
      ...prev,

      // update target section
      [section]: {
        // preserve other fields in the section
        ...prev[section],

        // mark the field as deleted
        [field]: true
      }
    }));
  };

  const handleRestoreDeduction = (section: DeductionSection, field: string) => {
    setDeletedDeductions(prev => ({
      // preserve other sections
      ...prev,

      // update target section
      [section]: {
        // preserve other fields in the section
        ...prev[section],

        // set deletion status to false
        [field]: false
      }
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // remove deleted deductions from the data
    const finalData: Deductions = {
      monthly: filterDeletedSectionData('monthly'),
      oneTime: filterDeletedSectionData('oneTime'),
      depreciation: filterDeletedSectionData('depreciation'),
    };

    onSubmit(finalData);
  };

  // helper to filter out deleted deductions
  const filterDeletedSectionData = (section: DeductionSection) => {
    const result: any = {};

    Object.keys(local[section]).forEach(key => {
      // skip if deleted
      if (deletedDeductions[section][key] === true) {
        return;
      }

      result[key] = local[section][key as keyof typeof local[typeof section]];
    });

    return result;
  };

  const addDepreciationItem = () => {
    setLocal(prev => ({
      ...prev,
      depreciation: {
        ...prev.depreciation,
        custom: [
          ...prev.depreciation.custom,
          {
            name: '',
            amount: 0,
            type: 'depreciation',
            purchaseDate: new Date().toISOString().split('T')[0],
            usefulLifeYears: 3,
            method: 'linear',
            degressiveRate: 25
          }
        ]
      }
    }));
  };

  const removeDepreciationItem = (index: number) => {
    setLocal(prev => {
      const updated = prev.depreciation.custom.filter((_, i) => i !== index);
      return {
        ...prev,
        depreciation: {
          ...prev.depreciation,
          custom: updated
        }
      };
    });
  };

  const handleDepreciationChange = (index: number, field: string, value: any) => {
    setLocal(prev => {
      const updated = [...prev.depreciation.custom];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return {
        ...prev,
        depreciation: {
          ...prev.depreciation,
          custom: updated
        }
      };
    });
  };

  return (
    <form
      className={`${styles.form} ${styles[theme]}`}
      onSubmit={handleFormSubmit}
    >
      <div className={styles.formHeader}>
        <BackButton onClick={onBack} />
        <h2 className={styles.title}>{t('Steuerabzüge')}</h2>
        <div className={styles.spacer}></div>
      </div>

      <DeductionsSection title={t("Monatliche Abzüge")}>
        <ExplanationBox>
          <h4>
            <InfoIcon />
            {t('Erklärung')}
          </h4>
          <p>{t('Monatliche Abzüge sind regelmäßige Ausgaben, die Sie jeden Monat haben:')}</p>
          <p>{t('Zum Beispiel:')}</p>
          <ul>
            <li>{t('Krankenversicherung: Monatliche Beiträge')}</li>
            <li>{t('Büro/Arbeitszimmer: Monatliche Mietkosten')}</li>
            <li>{t('Internet: Monatliche Gebühren')}</li>
          </ul>
          <p><strong>{t('Je nach Nutzung können Sie:')}</strong></p>
          <ul>
            <li><code>{t('100%')}</code> {t('absetzen, wenn die Kosten ausschließlich beruflich sind')}</li>
            <li><code>{t('50%')}</code> {t('absetzen, wenn eine private Mitnutzung besteht')}</li>
          </ul>
        </ExplanationBox>

        {!deletedDeductions.monthly.krankenversicherung && (
          <DeductionRow
            label="Krankenversicherung"
            min={INPUTS_DATA.taxDeductions.monthly.krankenversicherung.amount.min}
            max={INPUTS_DATA.taxDeductions.monthly.krankenversicherung.amount.max}
            step={INPUTS_DATA.taxDeductions.monthly.krankenversicherung.amount.step}
            amount={local.monthly.krankenversicherung.amount}
            type={local.monthly.krankenversicherung.type}
            deductionTypes={DEDUCTION_TYPES}
            onChange={({ amount, type }) =>
              handleChange('monthly', 'krankenversicherung', {
                ...local.monthly.krankenversicherung,
                amount: parseNumber((+amount).toString(), INPUTS_DATA.taxDeductions.monthly.krankenversicherung.amount.min, INPUTS_DATA.taxDeductions.monthly.krankenversicherung.amount.max),
                type
              })
            }
            onDelete={() => handleDeleteDefaultDeduction('monthly', 'krankenversicherung')}
          />
        )}

        {!deletedDeductions.monthly.buero && (
          <DeductionRow
            label="Büro/Arbeitszimmer"
            min={INPUTS_DATA.taxDeductions.monthly.buero.amount.min}
            max={INPUTS_DATA.taxDeductions.monthly.buero.amount.max}
            step={INPUTS_DATA.taxDeductions.monthly.buero.amount.step}
            amount={0}
            onChange={() => { }}
            onDelete={() => handleDeleteDefaultDeduction('monthly', 'buero')}
          >
            <BueroCalculator
              data={local.monthly.buero}
              onChange={(field, value) => handleBueroChange(field as keyof BueroData, value)}
            />
          </DeductionRow>
        )}

        {!deletedDeductions.monthly.internet && (
          <DeductionRow
            label="Internet"
            min={INPUTS_DATA.taxDeductions.monthly.internet.amount.min}
            max={INPUTS_DATA.taxDeductions.monthly.internet.amount.max}
            step={INPUTS_DATA.taxDeductions.monthly.internet.amount.step}
            amount={local.monthly.internet.amount}
            type={local.monthly.internet.type}
            deductionTypes={DEDUCTION_TYPES}
            onChange={({ amount, type }) =>
              handleChange('monthly', 'internet', {
                ...local.monthly.internet,
                amount: parseNumber((+amount).toString(), INPUTS_DATA.taxDeductions.monthly.internet.amount.min, INPUTS_DATA.taxDeductions.monthly.internet.amount.max),
                type
              })
            }
            onDelete={() => handleDeleteDefaultDeduction('monthly', 'internet')}
          />
        )}

        {/* restore buttons for deleted deductions */}
        {(deletedDeductions.monthly.krankenversicherung ||
          deletedDeductions.monthly.buero ||
          deletedDeductions.monthly.internet) && (
            <div className={styles.restoreSection}>
              <h4>{t('Gelöschte Standardabzüge')}</h4>
              <div className={styles.restoreButtons}>
                {deletedDeductions.monthly.krankenversicherung && (
                  <RestoreButton
                    onClick={() => handleRestoreDeduction('monthly', 'krankenversicherung')}
                    label={t('Krankenversicherung')}
                  />
                )}

                {deletedDeductions.monthly.buero && (
                  <RestoreButton
                    onClick={() => handleRestoreDeduction('monthly', 'buero')}
                    label={t('Büro/Arbeitszimmer')}
                  />
                )}

                {deletedDeductions.monthly.internet && (
                  <RestoreButton
                    onClick={() => handleRestoreDeduction('monthly', 'internet')}
                    label={t('Internet')}
                  />
                )}
              </div>
            </div>
          )}

        <CustomItemsList
          items={local.monthly.custom}
          min={INPUTS_DATA.taxDeductions.monthly.custom.amount.min}
          max={INPUTS_DATA.taxDeductions.monthly.custom.amount.max}
          step={INPUTS_DATA.taxDeductions.monthly.custom.amount.step}
          onAdd={() => addCustom('monthly')}
          onRemove={index => removeCustom('monthly', index)}
          onChange={(index, field, value) => handleCustomChange('monthly', index, field as keyof CustomDeduction, value)}
          deductionTypes={DEDUCTION_TYPES}
        />
      </DeductionsSection>

      <DeductionsSection title={t("Einmalige Ausgaben")}>
        <ExplanationBox>
          <h4>
            <InfoIcon />
            {t('Erklärung')}
          </h4>
          <p>{t('Einmalige Ausgaben sind Kosten, die nur einmal anfallen:')}</p>
          <p>{t('Zum Beispiel:')}</p>
          <ul>
            <li>{t('Anschaffungen, die nicht abgeschrieben werden müssen')}</li>
            <li>{t('Einzelzahlungen wie Fortbildungen oder Fachliteratur')}</li>
          </ul>
          <p><strong>{t('Je nach Art der Ausgabe können Sie:')}</strong></p>
          <ul>
            <li><code>{t('100%')}</code> {t('absetzen, wenn sie vollständig beruflich genutzt wird')}</li>
            <li><code>{t('50%')}</code> {t('absetzen, wenn eine private Mitnutzung vorliegt')}</li>
          </ul>
        </ExplanationBox>

        <CustomItemsList
          items={local.oneTime.custom}
          min={INPUTS_DATA.taxDeductions.oneTime.custom.amount.min}
          max={INPUTS_DATA.taxDeductions.oneTime.custom.amount.max}
          step={INPUTS_DATA.taxDeductions.oneTime.custom.amount.step}
          onAdd={() => addCustom('oneTime')}
          onRemove={index => removeCustom('oneTime', index)}
          onChange={(index, field, value) => handleCustomChange('oneTime', index, field as keyof CustomDeduction, value)}
          deductionTypes={DEDUCTION_TYPES}
        />
      </DeductionsSection>

      <DeductionsSection title={t("Abschreibung")}>
        <ExplanationBox>
          <h4>
            <InfoIcon />
            {t('Erklärung')}
          </h4>
          <p>{t('Hier tragen Sie Vermögensgegenstände ein, die über mehrere Jahre abgeschrieben werden:')}</p>
          <p>{t('Zum Beispiel:')}</p>
          <ul>
            <li><strong>{t('Bezeichnung')}</strong>: {t('z.B. Computer, Büromöbel')}</li>
            <li><strong>{t('Anschaffungskosten')}</strong>: {t('Der volle Kaufpreis')}</li>
            <li><strong>{t('Kaufdatum')}</strong>: {t('Wann Sie den Gegenstand gekauft haben')}</li>
            <li><strong>{t('Nutzungsdauer')}</strong>: {t('Wie viele Jahre abgeschrieben wird')}</li>
            <li><strong>{t('Methode')}</strong>: {t('Linear (gleichmäßig pro Jahr) oder degressiv (mehr am Anfang, weniger später)')}</li>
          </ul>
        </ExplanationBox>

        <DepreciationItemsList
          items={local.depreciation.custom}
          onAdd={() => addDepreciationItem()}
          onRemove={index => removeDepreciationItem(index)}
          onChange={(index, field, value) => handleDepreciationChange(index, field, value)}
        />
      </DeductionsSection>

      <div className={styles.navigationButtons}>
        <div></div>
        <button type="submit" className={styles.nextBtn}>
          {t('Berechnen')}
        </button>
      </div>
    </form>
  );
};

export default TaxDeductions;