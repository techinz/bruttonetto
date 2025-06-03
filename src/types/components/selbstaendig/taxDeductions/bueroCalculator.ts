export interface BueroData {
    amount: number;
    warmmiete: number;
    wholeSqm: number;
    officeSqm: number;
    isCalculated: boolean;
}

export interface BueroCalculatorProps {
    data: BueroData;
    onChange: (field: string, value: any) => void;
}
