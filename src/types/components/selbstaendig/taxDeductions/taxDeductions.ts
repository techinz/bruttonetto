export type DeductionSection = 'monthly' | 'oneTime' | 'depreciation';

export interface DeductionItem {
    amount: number;
    type: string;
    hasVat: boolean;
    vatAmount: number;
}

export interface BueroData {
    amount: number;
    warmmiete: number;
    wholeSqm: number;
    officeSqm: number;
    isCalculated: boolean;
    hasVat: boolean;
    vatAmount: number;
}

export interface CustomDeduction {
    name: string;
    amount: number;
    type: string;
    hasVat: boolean;
    vatAmount: number;
}

export interface MonthlyDeductions {
    krankenversicherung: DeductionItem;
    buero: BueroData;
    internet: DeductionItem;
    custom: CustomDeduction[];
}

export interface OneTimeDeductions {
    custom: CustomDeduction[];
}

export interface DepreciationItem extends CustomDeduction {
    purchaseDate: string;
    usefulLifeYears: number;
    method: 'linear' | 'degressive';
    degressiveRate?: number;
}

export interface DepreciationDeductions {
    custom: DepreciationItem[];
}

export interface Deductions {
    monthly: MonthlyDeductions;
    oneTime: OneTimeDeductions;
    depreciation: DepreciationDeductions;
}

export interface DeletedDeductions {
    monthly: Record<string, boolean>;
    oneTime: Record<string, boolean>;
    depreciation: Record<string, boolean>;
}

export interface TaxDeductionsProps {
    deductions: Deductions;
    isVatPayer: boolean;
    vatPercent: number;
    onSubmit: (deductions: Deductions) => void;
    onBack: () => void;
}