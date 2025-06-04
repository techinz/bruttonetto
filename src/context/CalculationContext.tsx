import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { DEFAULT_TAX_DEDUCTIONS } from '../config/config';
import { calculateResults, getDefaultSocialContributionsWithBrutto } from '../services/calculatorService';
import type { CalculationContextType } from '../types/context/calculationContext';
import type { CalculationResults } from '../types/services/calculatorService';
import type { SocialContributionsData } from '../types/components/selbstaendig/socialContributions/socialContributions';
import type { Deductions } from '../types/components/selbstaendig/taxDeductions/taxDeductions';

const defaultResults: CalculationResults = {
  netto: 0,
  afterSocialContributions: 0,
  taxableIncome: 0,
  steuer: 0,
  percentLoss: 0,
  outputVat: 0,
  vatToPay: 0,
  isVatPayer: true,
  vatPercent: 19
};

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export const CalculationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brutto, setBrutto] = useState<number>(0);
  const [isMarried, setIsMarried] = useState<boolean>(false);
  const [spouseYearlyIncome, setSpouseYearlyIncome] = useState<number>(0);
  const [isVatPayer, setIsVatPayer] = useState<boolean>(true);
  const [vatPercent, setVatPercent] = useState<number>(19);
  const [socialContributions, setSocialContributions] = useState<SocialContributionsData>({} as SocialContributionsData);
  const [taxDeductions, setTaxDeductions] = useState<Deductions>(DEFAULT_TAX_DEDUCTIONS);
  const [results, setResults] = useState<CalculationResults>(defaultResults);

  const updateBrutto = (value: number, isMarried: boolean, spouseYearlyIncome: number, isVatPayer: boolean, vatPercent: number) => {
    setBrutto(value);
    setIsMarried(isMarried);
    setSpouseYearlyIncome(spouseYearlyIncome);
    setIsVatPayer(isVatPayer);
    setVatPercent(vatPercent);
    setSocialContributions(getDefaultSocialContributionsWithBrutto(value));
  };

  const updateSocialContributions = (contributions: SocialContributionsData) => {
    setSocialContributions(contributions);

    // copy the krankenversicherung amount to tax deductions if checked
    if (contributions.mandatory.krankenversicherung.checked) {
      setTaxDeductions((prev: Deductions) => ({
        ...prev,
        monthly: {
          ...prev.monthly,
          krankenversicherung: {
            ...prev.monthly.krankenversicherung,
            amount: contributions.mandatory.krankenversicherung.amount
          }
        }
      }));
    }
  };

  const updateTaxDeductions = (deductions: Deductions) => {
    setTaxDeductions(deductions);
  };

  const finalizeCalculation = (deductions: Deductions) => {
    updateTaxDeductions(deductions);

    const calculatedResults = calculateResults(
      brutto,
      isMarried,
      spouseYearlyIncome,
      socialContributions,
      deductions,
      isVatPayer,
      vatPercent
    );
    setResults(calculatedResults);
  };

  const value = {
    brutto,
    setBrutto,
    socialContributions,
    setSocialContributions,
    taxDeductions,
    setTaxDeductions,
    results,
    setResults,
    updateBrutto,
    updateSocialContributions,
    updateTaxDeductions,
    finalizeCalculation
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};

export const useCalculation = () => {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
};