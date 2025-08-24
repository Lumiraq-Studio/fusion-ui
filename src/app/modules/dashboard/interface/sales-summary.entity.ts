export interface SalesSummaryDTO {
    salesRepId: number
    orderDate: string
    salesRepName: string
    totalOrders: number
    totalSales: number
    cashOnHand: number
    unpaidAmount: number
}
