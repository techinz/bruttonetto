import type { SocialContributionsData } from "../socialContributions/socialContributions";
import type { Deductions } from "../taxDeductions/taxDeductions";
import type { CalculationResults } from "./resultDisplay";

export interface ExportPdfButtonProps {
    results: CalculationResults;
    brutto: number;
    isMarried?: boolean;
    spouseIncome?: number;
    socialContributions: SocialContributionsData;
    taxDeductions: Deductions;
    taxSavings?: { individualTax: number; splittingTax: number; savings: number } | null;
}