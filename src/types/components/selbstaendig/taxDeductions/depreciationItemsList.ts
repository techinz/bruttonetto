import type { DepreciationItem } from "./taxDeductions";

export interface DepreciationItemsListProps {
    items: DepreciationItem[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: string, value: any) => void;
}
