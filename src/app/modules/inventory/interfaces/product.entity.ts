export interface ProductFindDTO {
    id: number;
    sku: string;
    name: string;
    description: string;
    totalSoldQty: number;
    warehouseCode: string;
    totalAssignedQty: number;
    totalRemainingQty: number;
}


export interface ProductCreateDTO {
    productName: string
    description: string
    warehouseId: number
    createdBy?: string
}


export interface ProductDetailsDto {
    productId: number;
    productName: string;
    sku: string;
    description: string;
    warehouseId: number;
    warehouseDetails: WarehouseDetailsDto;
    variants: ProductVariantDto[];
}

export interface WarehouseDetailsDto {
    contactNo: string;
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    warehouseAddress: string;
    contactPersonName: string;
}

export interface ProductVariantDto {
    variantId: number;
    sku: string
    unit: string
    stockId: number
    newQuantity?: number
    isAssigned?: boolean;
    weight: number
    basePrice: number
    availableQTY: number
}

export interface StockCreateDto {
    stockQty: number
    variantId: number
    basePrice?: number
    createdBy: number
    warehouseId: number
}

export interface PriceDto {
    variant_id: number
    forAll: number
    price_val: number
}
