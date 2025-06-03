import React from 'react';
import styles from './ExplanationBox.module.css';
import type { ExplanationBoxProps } from '../../../../types/components/selbstaendig/taxDeductions/explanationBox';

/**
 * Display an info box
 * 
 * @param {React.ReactNode} children - The content to be displayed inside the box
 */
const ExplanationBox: React.FC<ExplanationBoxProps> = ({ children }) => {
  return (
    <div className={styles.explanationBox}>
      <div className={styles.explanationContent}>
        {children}
      </div>
    </div>
  );
};

export default ExplanationBox;