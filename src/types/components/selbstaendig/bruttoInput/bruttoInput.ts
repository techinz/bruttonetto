export interface BruttoInputProps {
    onSubmit: (value: number, isMarried: boolean, spouseIncome: number, isVatPayer: boolean, vatPercent: number) => void;
}