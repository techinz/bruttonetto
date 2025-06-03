export interface SocialContribution {
  name: string;
  percent: number;
  amount: number;
  checked: boolean;
}

export interface SocialContributions {
  mandatory: Record<string, SocialContribution>;
  voluntary: Record<string, SocialContribution>;
}

export interface DeductionItem {
  amount: number;
  type: string;
}

export interface BueroData {
  officeSqm: number;
  totalSqm: number;
  rentPerMonth: number;
  utilities: number;
  amount: number;
}

export interface MonthlyDeductions {
  krankenversicherung: DeductionItem;
  buero: BueroData;
  internet: DeductionItem;
  custom: CustomDeduction[];
}

export interface CustomDeduction {
  name: string;
  amount: number;
  type: string;
}

export interface OneTimeDeductions {
  custom: CustomDeduction[];
}

export interface TaxDeductions {
  monthly: MonthlyDeductions;
  oneTime: OneTimeDeductions;
  deleted?: {
    monthly: Record<string, boolean>;
    oneTime: Record<string, boolean>;
  };
}