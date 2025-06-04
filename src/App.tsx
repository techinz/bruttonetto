import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './App.module.css';
import BruttoInput from './components/selbstaendig/BruttoInput/BruttoInput';
import SocialContributions from './components/selbstaendig/SocialContributions/SocialContributions';
import TaxDeductions from './components/selbstaendig/TaxDeductions/TaxDeductions';
import ResultDisplay from './components/selbstaendig/ResultDisplay/ResultDisplay';
import LanguageSelector from './components/ui/LanguageSelector/LanguageSelector';
import TabNavigation from './components/ui/TabNavigation/TabNavigation';
import ComingSoon from './components/ui/ComingSoon/ComingSoon';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { CalculationProvider, useCalculation } from './context/CalculationContext';
import { LanguageProvider } from './context/LanguageContext';
import { useStepNavigation } from './hooks/useStepNavigation';
import { MoonIcon, SunIcon } from './components/ui/icons';
import './i18n/i18n';
import GithubLink from './components/ui/GithubLink/GithubLink';
import type { TabType } from './types/components/ui/tabNavigation/tabNavigation';
import type { SocialContributionsData } from './types/components/selbstaendig/socialContributions/socialContributions';
import type { Deductions } from './types/components/selbstaendig/taxDeductions/taxDeductions';
import DisclaimerFooter from './components/ui/DisclaimerFooter/DisclaimerFooter';
import { Analytics } from "@vercel/analytics/react"

function AppContent() {
  const { t } = useTranslation();
  const { currentStep, goToNextStep, goToPreviousStep, goToStep } = useStepNavigation();
  const {
    brutto, updateBrutto, socialContributions, updateSocialContributions,
    taxDeductions, finalizeCalculation, results
  } = useCalculation();
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [isMarried, setIsMarried] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState(0);
  const [isVatPayer, setIsVatPayer] = useState<boolean>(true);
  const [vatPercent, setVatPercent] = useState<number>(19);
  const [activeTab, setActiveTab] = useState<TabType>('selbstaendig');

  // default theme - dark
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      document.body.className = 'dark';
    }
  }, []);

  // navigation handlers
  const handleBruttoSubmit = (value: number, isMarried: boolean, spouseIncome: number, isVatPayer: boolean, vatPercent: number) => {
    updateBrutto(value, isMarried, spouseIncome, isVatPayer, vatPercent);
    setIsMarried(isMarried);
    setSpouseIncome(spouseIncome);
    setIsVatPayer(isVatPayer);
    setVatPercent(vatPercent);
    goToNextStep();
  };

  const handleSocialContributionsSubmit = (contributions: SocialContributionsData) => {
    updateSocialContributions(contributions);
    goToNextStep();
  };

  const handleDeductionsSubmit = (deductions: Deductions) => {
    finalizeCalculation(deductions);
    goToNextStep();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'selbstaendig') {
      goToStep('brutto');
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <header className={styles.header}>
        <a href="/" className={styles.headerLink}>
          <div className={styles.logoContainer}>
            <img src="/favicon/android-chrome-512x512.png" alt="" className={styles.logo} />
            <h1>bruttonetto.tools</h1>
          </div>
        </a>
        <div className={styles.headerControls}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={theme === 'light' ? t('Dark Mode einschalten') : t('Light Mode einschalten')}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className={styles.content}>
        {activeTab === 'selbstaendig' ? (
          <>
            {currentStep === 'brutto' && (
              <BruttoInput onSubmit={handleBruttoSubmit} />
            )}

            {currentStep === 'social' && (
              <SocialContributions
                socialContributions={socialContributions}
                brutto={brutto}
                onSubmit={handleSocialContributionsSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'deductions' && (
              <TaxDeductions
                deductions={taxDeductions}
                isVatPayer={isVatPayer}
                vatPercent={vatPercent}
                onSubmit={handleDeductionsSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'results' && (
              <ResultDisplay
                results={results}
                brutto={brutto}
                isMarried={isMarried}
                spouseIncome={spouseIncome}
                socialContributions={socialContributions}
                taxDeductions={taxDeductions}
                onBackToStart={() => goToStep('brutto')}
              />
            )}
          </>
        ) : (
          <ComingSoon text={t('Der Steuerrechner für Angestellte ist in Entwicklung. Da ich meine Entwicklungsressourcen effizient einsetzen möchte, würde ich gerne wissen, wie hoch das Interesse an dieser Funktion ist. Falls Sie diese Funktion dringend benötigen oder Vorschläge haben, kontaktieren Sie mich bitte unter contact@techinz.dev.')} />
        )}
      </main>

      {activeTab === 'selbstaendig' && (
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{
              width: currentStep === 'brutto' ? '25%' :
                currentStep === 'social' ? '50%' :
                  currentStep === 'deductions' ? '75%' : '100%'
            }}
          ></div>
        </div>
      )}

      <GithubLink />
      <DisclaimerFooter />
    </div>
  );
}

function App() {
  return (
    <>
      <ThemeProvider>
        <LanguageProvider>
          <CalculationProvider>
            <AppContent />
          </CalculationProvider>
        </LanguageProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default App;