export interface DeductionType {
    value: string;
    label: string;
}

export interface DeductionRowProps {
    label: string;
    min: number;
    max: number;
    step: number;
    amount: number;
    type?: string;
    deductionTypes?: DeductionType[];
    onChange: (value: any) => void;
    onDelete?: () => void;
    children?: React.ReactNode;
    isDefault?: boolean;
}
