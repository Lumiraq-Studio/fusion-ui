export interface VariantDTO {
    id: number;
    sku: string | null;
    name: string;
    variants: {
        unit: string;
        weight: number;
        basePrice: number | null;
    }[];
}

export interface VariantCreateDTO {

    weight: number;
    unit: string;
    productId: number;
    basePrice: number,
    productName: string;
    cost: number,
    createdBy: number;
}
