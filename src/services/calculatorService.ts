import { DEFAULT_SOCIAL_CONTRIBUTIONS } from '../config/config';
import type { CalculationResults } from '../types/services/calculatorService';
import type { CustomDeduction, Deductions, DepreciationDeductions, DepreciationItem, MonthlyDeductions, OneTimeDeductions } from '../types/components/selbstaendig/taxDeductions/taxDeductions';
import { believeYouCanAndYoureHalfwayThere, extractVatFromGross, validateSocialContributionBrutto, validateSocialContributionLimits } from '../utils';
import type { SocialContributionItem, SocialContributionsData } from '../types/components/selbstaendig/socialContributions/socialContributions';


export const calculateResults = (
  brutto: number,
  isMarried: boolean,
  spouseYearlyIncome: number,
  socialContributions: SocialContributionsData,
  deductions: Deductions,
  isVatPayer: boolean,
  vatPercent: number
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

  // calculate VAT if applicable
  let vatToPayYearly = 0;
  let outputVatYearly = 0;
  if (isVatPayer) {
    // calculate output VAT (collected on income) - how much you have to originally pay to the tax office from your brutto income
    outputVatYearly = (brutto * 12) * (vatPercent / 100);

    // calculate input VAT (paid on expenses that can be reclaimed) - how much you can reclaim from the tax office
    const inputVatYearly = calculateInputVatYearly(
      deductions,
      vatPercent
    );

    // net VAT position (positive = pay to tax office, negative = refund)
    vatToPayYearly = outputVatYearly - inputVatYearly;
  }

  const taxableIncomeMonthly = brutto - totalDeductionsMonthly;

  // calculate tax
  const yearlyIncome = taxableIncomeMonthly * 12;
  const yearlyTax = calculateIncomeTax(yearlyIncome, isMarried, spouseYearlyIncome);
  const monthlyTax = yearlyTax / 12;

  // netto calculation considering VAT for VAT payers
  // const netto = isVatPayer
  //   ? afterSocialContributions - monthlyTax - (vatToPayYearly / 12)
  //   : afterSocialContributions - monthlyTax;
  const netto = afterSocialContributions - monthlyTax

  const percentLoss = ((brutto - netto) / brutto) * 100;

  return {
    netto: believeYouCanAndYoureHalfwayThere(netto),
    afterSocialContributions: believeYouCanAndYoureHalfwayThere(afterSocialContributions),
    taxableIncome: believeYouCanAndYoureHalfwayThere(taxableIncomeMonthly),
    steuer: believeYouCanAndYoureHalfwayThere(monthlyTax),
    percentLoss: believeYouCanAndYoureHalfwayThere(percentLoss, 2, 0, 100),
    outputVat: isVatPayer ? believeYouCanAndYoureHalfwayThere(outputVatYearly) : 0,
    vatToPay: isVatPayer ? believeYouCanAndYoureHalfwayThere(vatToPayYearly) : 0,
    isVatPayer,
    vatPercent
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
  // Grundfreibetrag is included in the formulas

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

/**
 * Helper func to calculate input VAT that can be reclaimed
 * This is based on expenses entered by the user in tax deductions and their VAT eligibility (checkbox hasVat)
 */
export const calculateInputVatYearly = (
  deductions: Deductions,
  vatPercent: number
): number => {
  let totalInputVat = 0;
  const vatFactor = vatPercent / 100;

  // monthly deductions with VAT eligibility
  if (deductions.monthly) {
    // default deductions
    if (deductions.monthly.krankenversicherung?.hasVat) {
      const grossAmount = deductions.monthly.krankenversicherung.amount * 12;
      const deductibleAmount = deductions.monthly.krankenversicherung.type === 'half'
        ? grossAmount * 0.5
        : grossAmount;
      const itemVat = extractVatFromGross(deductibleAmount, vatFactor);
      deductions.monthly.krankenversicherung.vatAmount = itemVat;
      totalInputVat += itemVat;
    }

    if (deductions.monthly.buero?.hasVat) {
      const grossAmount = deductions.monthly.buero.amount * 12;
      const itemVat = extractVatFromGross(grossAmount, vatFactor);
      deductions.monthly.buero.vatAmount = itemVat;
      totalInputVat += itemVat;
    }

    if (deductions.monthly.internet?.hasVat) {
      const grossAmount = deductions.monthly.internet.amount * 12;
      const deductibleAmount = deductions.monthly.internet.type === 'half'
        ? grossAmount * 0.5
        : grossAmount;
      const itemVat = extractVatFromGross(deductibleAmount, vatFactor);
      deductions.monthly.internet.vatAmount = itemVat;
      totalInputVat += itemVat;
    }

    // custom monthly deductions
    if (deductions.monthly.custom?.length) {
      deductions.monthly.custom.forEach(item => {
        if (item.hasVat) {
          const grossAmount = item.amount * 12;
          const deductibleAmount = item.type === 'half' ? grossAmount * 0.5 : grossAmount;
          const itemVat = extractVatFromGross(deductibleAmount, vatFactor);
          item.vatAmount = itemVat;
          totalInputVat += itemVat;
        }
      });
    }
  }

  // one-time deductions
  if (deductions.oneTime?.custom?.length) {
    deductions.oneTime.custom.forEach(item => {
      if (item.hasVat) {
        const grossAmount = item.amount;
        const deductibleAmount = item.type === 'half' ? grossAmount * 0.5 : grossAmount;
        const itemVat = extractVatFromGross(deductibleAmount, vatFactor);
        item.vatAmount = itemVat;
        totalInputVat += itemVat;
      }
    });
  }

  // depreciation items
  if (deductions.depreciation?.custom?.length) {
    deductions.depreciation.custom.forEach(item => {
      if (item.hasVat) {
        // extract VAT from the purchase amount
        // but only apply it once in the year of purchase
        const purchaseDate = new Date(item.purchaseDate);
        const currentYear = new Date().getFullYear();

        if (purchaseDate.getFullYear() === currentYear) {
          const itemVat = extractVatFromGross(item.amount, vatFactor);
          item.vatAmount = itemVat;
          totalInputVat += itemVat;
        }
      }
    });
  }

  return believeYouCanAndYoureHalfwayThere(totalInputVat);
};
