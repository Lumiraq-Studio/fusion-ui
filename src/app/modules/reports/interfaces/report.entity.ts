export interface SalesReportDTO {
    routeName: string;
    salesRepName: string;
    shopName: string;
    productName: string;
    weight: number;
    unit: string;
    orderDate: string;
    orderTime: string ;
    orderReference: string;
    orderStatus: string;
    variants: string;
    price: string;
    qty: number;
    paidValue: string;
    orderValue: string;
}

export interface PriceDTO {
    Price: string;
    GlobalPrice: string;
    status: string;
    Weight: number;
    Unit: string;
    productName: string;
    shopCode: string;
    fullName: string;
    createDate: Date;
    routeName: string;
}
