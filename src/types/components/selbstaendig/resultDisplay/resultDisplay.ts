import type { SocialContributionsData } from "../socialContributions/socialContributions";
import type { Deductions } from "../taxDeductions/taxDeductions";

export interface CalculationResults {
    netto: number;
    afterSocialContributions: number;
    taxableIncome: number;
    steuer: number;
    percentLoss: number;
    outputVat: number;
    vatToPay: number,
    isVatPayer: boolean,
    vatPercent: number
}

export interface ResultDisplayProps {
    results: CalculationResults;
    brutto: number;
    isMarried?: boolean;
    spouseIncome?: number;
    socialContributions: SocialContributionsData;
    taxDeductions: Deductions;
    onBackToStart: () => void;
}
