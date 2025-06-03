import { DEFAULT_SOCIAL_CONTRIBUTIONS, ONE_BILLION } from '../config/config';
import type { CalculationResults } from '../types/services/calculatorService';
import type { CustomDeduction, Deductions, DepreciationDeductions, DepreciationItem, MonthlyDeductions, OneTimeDeductions } from '../types/components/selbstaendig/taxDeductions/taxDeductions';
import { round, validateSocialContributionBrutto, validateSocialContributionLimits } from '../utils';
import type { SocialContributionItem, SocialContributionsData } from '../types/components/selbstaendig/socialContributions/socialContributions';

function believeYouCanAndYoureHalfwayThere(value: number, roundDecimals: number = 2, min: number = 0, max: number = ONE_BILLION): number {
  // Function to ensure the value is safe for display

  if (isNaN(value) || value === null || value === undefined) {
    return 0;
  }

  return round(Math.min(Math.max(value, min), max), roundDecimals);
}

export const calculateResults = (
  brutto: number,
  isMarried: boolean,
  spouseYearlyIncome: number,
  socialContributions: SocialContributionsData,
  deductions: Deductions,
): CalculationResults => {
  // calculate amount left after social contributions
  const socialContributionsTotal = [
    ...Object.values(socialContributions.mandatory || {}),
    ...Object.values(socialContributions.voluntary || {})
  ].reduce((total: number, item: any) => item.checked ? total + item.amount : total, 0);

  const afterSocialContributions = brutto - socialContributionsTotal;

  // calculate deductions
  const monthlyDeductions = calculateMonthlyDeductions(deductions.monthly);
  const oneTimeDeductions = calculateOneTimeDeductions(deductions.oneTime);
  const depreciationDeductions = calculateDepreciationDeductions(deductions.depreciation);
  const totalDeductionsMonthly = monthlyDeductions + (oneTimeDeductions / 12) + depreciationDeductions;

  const taxableIncomeMonthly = brutto - totalDeductionsMonthly;

  // calculate tax
  const yearlyIncome = taxableIncomeMonthly * 12;
  const yearlyTax = calculateIncomeTax(yearlyIncome, isMarried, spouseYearlyIncome);
  const monthlyTax = yearlyTax / 12;

  const netto = afterSocialContributions - monthlyTax;
  const percentLoss = ((brutto - netto) / brutto) * 100;

  return {
    netto: believeYouCanAndYoureHalfwayThere(netto),
    afterSocialContributions: believeYouCanAndYoureHalfwayThere(afterSocialContributions),
    taxableIncome: believeYouCanAndYoureHalfwayThere(taxableIncomeMonthly),
    steuer: believeYouCanAndYoureHalfwayThere(monthlyTax),
    percentLoss: believeYouCanAndYoureHalfwayThere(percentLoss, 2, 0, 100)
  };
};

/**
 * Calculate depreciation deductions
 */
export const calculateDepreciationDeductions = (depreciation: DepreciationDeductions): number => {
  let total = 0;

  if (depreciation?.custom && depreciation.custom.length) {
    const currentDate = new Date();

    depreciation.custom.forEach((item: DepreciationItem) => {
      const monthlyDepreciationAmount = calculateItemDepreciation(item, currentDate);
      total += monthlyDepreciationAmount;
    });
  }

  return believeYouCanAndYoureHalfwayThere(total);
};

/**
 * Calculate the monthly depreciation amount for a single item
 */
export const calculateItemDepreciation = (item: DepreciationItem, currentDate: Date): number => {
  const {
    amount,
    purchaseDate,
    usefulLifeYears = 3,
    method = 'linear',
    degressiveRate = 25 // 25% by default
  } = item;

  if (!purchaseDate || !amount || amount <= 0 || !usefulLifeYears) {
    return 0;
  }

  const decimalDegressiveRate = degressiveRate / 100;

  const purchaseDateObj = new Date(purchaseDate);

  // сalculate total age in days and years
  const ageInDays = (currentDate.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24);
  const ageInYears = ageInDays / 365.25;

  // if the asset is fully depreciated, return 0
  if (ageInYears >= usefulLifeYears) {
    return 0;
  }

  let yearlyDepreciation = 0;

  if (method === 'linear') {
    // same amount each year
    yearlyDepreciation = amount / usefulLifeYears;
  } else if (method === 'degressive') {
    // percentage of remaining value
    const yearsCompleted = Math.floor(ageInYears);
    let remainingValue = amount;

    // calculate remaining value at the start of the current year
    for (let i = 0; i < yearsCompleted; i++) {
      remainingValue -= remainingValue * decimalDegressiveRate;
    }

    yearlyDepreciation = remainingValue * decimalDegressiveRate;

    // check if we should switch to linear method
    // (this follows German tax rules where you switch to linear when it provides higher deduction)
    const remainingYears = usefulLifeYears - yearsCompleted;
    const linearFromNow = remainingValue / remainingYears;

    if (linearFromNow > yearlyDepreciation) {
      yearlyDepreciation = linearFromNow;
    }
  }

  const monthlyDepreciation = yearlyDepreciation / 12;

  return believeYouCanAndYoureHalfwayThere(monthlyDepreciation);
};

export const calculateMonthlyDeductions = (monthlyDeductions: MonthlyDeductions): number => {
  let total = 0;

  // krankenversicherung if not deleted
  if (monthlyDeductions.krankenversicherung) {
    total += monthlyDeductions.krankenversicherung.amount;
  }

  // buero/arbeitszimmer if not deleted
  if (monthlyDeductions.buero && monthlyDeductions.buero.amount > 0) {
    total += monthlyDeductions.buero.amount;
  }

  // internet if not deleted
  if (monthlyDeductions.internet) {
    total += monthlyDeductions.internet.type === 'half'
      ? monthlyDeductions.internet.amount * 0.5
      : monthlyDeductions.internet.amount;
  }

  // custom monthly deductions
  if (monthlyDeductions.custom && monthlyDeductions.custom.length) {
    monthlyDeductions.custom.forEach((item: CustomDeduction) => {
      if (item.type === 'half') {
        total += item.amount * 0.5;
      } else if (item.type === 'full') {
        total += item.amount;
      }
    });
  }

  return believeYouCanAndYoureHalfwayThere(total);
};

export const calculateOneTimeDeductions = (oneTimeDeductions: OneTimeDeductions): number => {
  let total = 0;

  if (oneTimeDeductions.custom && oneTimeDeductions.custom.length) {
    oneTimeDeductions.custom.forEach((item: CustomDeduction) => {
      if (item.type === 'half') {
        total += item.amount * 0.5;
      } else if (item.type === 'full') {
        total += item.amount;
      }
    });
  }

  return believeYouCanAndYoureHalfwayThere(total);
};

export const calculateSingleTax = (yearlyIncome: number): number => {
  // German income tax calculation based on latest 2025 formulas from https://www.bmf-steuerrechner.de/ekst/eingabeformekst.xhtml?ekst-result=true
  let tax = 0;

  if (yearlyIncome <= 12096) {
    tax = 0;
  } else if (yearlyIncome <= 17443) {
    const y = (yearlyIncome - 12096) / 10000;
    tax = (932.3 * y + 1400) * y;
  } else if (yearlyIncome <= 68480) {
    const z = (yearlyIncome - 17443) / 10000;
    tax = (176.64 * z + 2397) * z + 1015.13;
  } else if (yearlyIncome <= 277825) {
    tax = 0.42 * yearlyIncome - 10911.92;
  } else {
    tax = 0.45 * yearlyIncome - 19246.67;
  }

  return believeYouCanAndYoureHalfwayThere(tax);
};

export const calculateIncomeTax = (
  yearlyIncome: number,
  isMarried: boolean,
  spouseYearlyIncome: number
): number => {
  if (!isMarried) {
    return calculateSingleTax(yearlyIncome);
  } else {
    // Ehegattensplitting 
    const combinedIncome = yearlyIncome + spouseYearlyIncome;
    const splitIncome = combinedIncome / 2;

    const taxOnSplitIncome = calculateSingleTax(splitIncome);

    return taxOnSplitIncome * 2;
  }
};

export const getDefaultSocialContributionsWithBrutto = (brutto: number) => {
  // pre-calculate social contribution amounts

  return {
    mandatory: Object.entries(DEFAULT_SOCIAL_CONTRIBUTIONS.mandatory).reduce((acc, [key, item]: [string, SocialContributionItem]) => {
      return {
        ...acc,
        [key]: {
          ...item,
          label: item.label,
          amount: validateSocialContributionLimits(item, believeYouCanAndYoureHalfwayThere((item.percent / 100) * validateSocialContributionBrutto(item, brutto)))
        }
      };
    }, {}),
    voluntary: Object.entries(DEFAULT_SOCIAL_CONTRIBUTIONS.voluntary).reduce((acc, [key, item]: [string, SocialContributionItem]) => {
      return {
        ...acc,
        [key]: {
          ...item,
          label: item.label,
          amount: validateSocialContributionLimits(item, believeYouCanAndYoureHalfwayThere((item.percent / 100) * validateSocialContributionBrutto(item, brutto)))
        }
      };
    }, {})
  };
};
