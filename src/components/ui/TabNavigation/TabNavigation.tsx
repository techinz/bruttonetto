import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TabNavigation.module.css';
import type { TabType } from '../../../types/components/ui/tabNavigation/tabNavigation';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'selbstaendig' ? styles.active : ''}`}
          onClick={() => onTabChange('selbstaendig')}
          aria-selected={activeTab === 'selbstaendig'}
          role="tab"
        >
          {t('Selbständig')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'angestellt' ? styles.active : ''}`}
          onClick={() => onTabChange('angestellt')}
          aria-selected={activeTab === 'angestellt'}
          role="tab"
        >
          {t('Angestellt')}
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;