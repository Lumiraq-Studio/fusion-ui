export interface ViewRepStockDTO {

    salesRepId: number,
    name: string;
    status: string;
    contactDetails: string;
    repStocks: {
        repStockId: number;
        assignedQty: number;
        soldQty: number
        remainingQty: number
        status: string;
        createdAt: string;
        updatedAt: string
        variantWeight: number;
        variantUnit: string;
        productStockId: number;
        productVariantId: number;
    }
}


export interface SalesRepStockFind {
    id: number;
    sku: string;
    unit: string;
    status: string;
    weight: string;
    soldQty: number | null;
    assignedQty: number;
    repId: number;
    variantId: number;
    productName: string;
    remainingQty: number;
    salesPersonName: string;
}

export interface SalesRepStockGet {
    id: number;
    productId: number;
    productName: string;
    salesPersonName: string;
    sku: string;
    variantId: number;
    weight: number;
    unit: string;
    status: string;
    assignedQty: number;
    soldQty: number | null;
    remainingQty: number;
}
