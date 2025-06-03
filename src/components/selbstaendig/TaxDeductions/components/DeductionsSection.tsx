import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeductionsSection.module.css';
import type { DeductionsSectionProps } from '../../../../types/components/selbstaendig/taxDeductions/deductionsSection';

/**
 * Display a deductionn section with a title and content
 * 
 * @param {string} title - The title of the section
 * @param {React.ReactNode} children - The content to be displayed inside the section
 */
const DeductionsSection: React.FC<DeductionsSectionProps> = ({ title, children }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.section}>
      <h3>{t(title)}</h3>
      {children}
    </div>
  );
};

export default DeductionsSection;