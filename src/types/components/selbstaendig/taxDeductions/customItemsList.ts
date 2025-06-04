export interface DeductionType {
    value: string;
    label: string;
}

export interface CustomItem {
    name: string;
    amount: number;
    type?: string;
    hasVat: boolean;
}

export interface CustomItemsListProps {
    items: CustomItem[];
    min: number;
    max: number;
    step: number;
    isVatPayer: boolean;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: any) => void;
    deductionTypes?: DeductionType[];
}
