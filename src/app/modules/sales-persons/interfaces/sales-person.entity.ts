export interface SalePersonDTO {
    id: number
    name: string
    status: string
    contactDetails: string
}
interface VariantDto {
    soldQty: number;
    variant: string;
    variantId: number;
    assignDate: string;
    assignedQty: number;
    remainingQty: number;
    variantStockId: number;
    stockBreakdownId: number;
}

interface ProductDto {
    variants: VariantDto[];
    productId: number;
    productName: string;
}

export interface SalesRepStockDto {
    salesRepId: number;
    salesRepName: string;
    availableStock: ProductDto[];
}