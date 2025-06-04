import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VatNotice.module.css';
import type { VatNoticeProps } from '../../../../types/components/selbstaendig/taxDeductions/vatNotice';
import { InfoIcon, FailIcon, SuccessIcon } from '../../../ui/icons';

/**
 * Displays VAT notice based on user's VAT status
 * 
 * @param {boolean} isVatPayer - Whether the user is VAT registered
 * @param {number} vatPercent - The VAT percent (19% or 7%)
 */
const VatNotice: React.FC<VatNoticeProps> = ({
  isVatPayer,
  vatPercent,
}) => {
  const { t } = useTranslation();

  const getMessage = () => {
    if (isVatPayer) {
      return t('Bitte geben Sie alle Kosten inklusive Umsatzsteuer ein (Brutto-Beträge). Bei Ausgaben mit USt.-Häkchen wird die Vorsteuer automatisch berechnet');
    } else {
      return t('Alle Kosten inklusive Umsatzsteuer angeben - Vorsteuerabzug ist nicht möglich');
    }
  };

  return (
    <div className={`${styles.vatNotice} ${isVatPayer ? styles.vatPayer : styles.kleinunternehmer}`}>
      <div className={styles.vatNoticeContent}>
        <h4>{t('Hinweis')}</h4>
        <p>{getMessage()}</p>
        {isVatPayer && (
          <p className={styles.vatRateInfo}>
            {t('Es wird mit einem Umsatzsteuersatz von {{vatPercent}}% gerechnet', { vatPercent: vatPercent })}
          </p>
        )}
      </div>

      {isVatPayer && (
        <div className={styles.vatHelpBox}>
          <div className={styles.vatHelpHeader}>
            <InfoIcon />
            <h4>{t('Vorsteuerabzug - Welche Kosten sind berechtigt?')}</h4>
          </div>

          <div className={styles.vatHelpContent}>
            <div className={styles.vatColumns}>
              <div className={`${styles.vatSection} ${styles.notEligibleSection}`}>
                <div className={styles.vatSectionHeader}>
                  <span className={styles.xIcon}><FailIcon /></span>
                  <h5 className={styles.notEligible}>{t('Nicht vorsteuerabzugsberechtigt:')}</h5>
                </div>
                <ul>
                  <li>{t('Krankenversicherung (keine USt.)')}</li>
                  <li>{t('Miete / Arbeitszimmer / Nebenkosten (in der Regel ohne USt.)')}</li>
                  <li>{t('Internet/Handy (wenn Vertrag auf Privatperson)')}</li>
                  <li>{t('Versicherungen allgemein (keine USt.)')}</li>
                </ul>
              </div>

              <div className={`${styles.vatSection} ${styles.eligibleSection}`}>
                <div className={styles.vatSectionHeader}>
                  <span className={styles.checkIcon}><SuccessIcon /></span>
                  <h5 className={styles.eligible}>{t('Vorsteuerabzugsberechtigt:')}</h5>
                </div>
                <p>{t('Nur wenn:')}</p>
                <ul>
                  <li>{t('Eine Rechnung mit ausgewiesener USt. vorliegt')}</li>
                  <li>{t('Der Gegenstand/die Dienstleistung geschäftlich genutzt wird')}</li>
                </ul>
                <p><strong>{t('Beispiele:')}</strong> {t('Büromöbel, Computer, Software (mit Rechnung und geschäftlicher Nutzung)')}</p>
              </div>
            </div>

            <div className={styles.vatRule}>
              <p><strong>{t('Grundregel:')}</strong> {t('Aktivieren Sie das USt.-Kästchen nur für Ausgaben, bei denen Sie eine Rechnung mit separat ausgewiesener Umsatzsteuer haben')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VatNotice;