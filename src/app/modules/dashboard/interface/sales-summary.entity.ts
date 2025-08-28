export interface SalesSummaryDTO {
    salesRepId: number
    orderDate: string
    salesRepName: string
    totalOrders: number
    totalSales: number
    cashOnHand: number
    unpaidAmount: number
}


export interface BaseStatistics {
    TotalOrdersThisMonth: number;
    UnpaidOrders: number;
    UnpaidOrdersOverMonth: number;
    ActiveCustomersAllTime: number;
    CustomersThisMonth: number;
    CustomersLastMonth: number;
    CustomerChangePercentage: string;
    RevenueThisMonth: number;
    RevenueLastMonth: number;
    RevenueChangePercentage: string;
}

export interface SalesWeekItem {
    WeekDay: string;
    TotalSales: string;
    TotalExpenses: string;
}

export interface MonthlyPerformanceItem {
    MonthShort: string;
    MonthlyRevenue: string;
    OrdersCount: string;
}