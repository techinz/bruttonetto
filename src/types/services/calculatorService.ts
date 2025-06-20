export interface CalculationResults {
    netto: number;
    afterSocialContributions: number;
    taxableIncome: number;
    steuer: number;
    percentLoss: number;
    outputVat: number;
    vatToPay: number;
    isVatPayer: boolean;
    vatPercent: number;
}