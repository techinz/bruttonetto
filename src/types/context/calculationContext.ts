import type { CalculationResults } from "../components/selbstaendig/resultDisplay/resultDisplay";
import type { SocialContributionsData } from "../components/selbstaendig/socialContributions/socialContributions";
import type { Deductions } from "../components/selbstaendig/taxDeductions/taxDeductions";

export interface CalculationContextType {
    brutto: number;
    setBrutto: (value: number) => void;
    socialContributions: SocialContributionsData;
    setSocialContributions: (value: SocialContributionsData) => void;
    taxDeductions: Deductions;
    setTaxDeductions: (value: Deductions) => void;
    results: CalculationResults;
    setResults: (value: CalculationResults) => void;
    updateBrutto: (value: number, isMarried: boolean, spouseYearlyIncome: number) => void;
    updateSocialContributions: (contributions: SocialContributionsData) => void;
    updateTaxDeductions: (deductions: Deductions) => void;
    finalizeCalculation: (deductions: Deductions) => void;
}
