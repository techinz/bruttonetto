import type { DepreciationItem } from "./taxDeductions";

export interface DepreciationItemsListProps {
    items: DepreciationItem[];
    isVatPayer: boolean;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: any) => void;
}
