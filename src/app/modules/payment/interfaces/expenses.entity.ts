export interface SalesRepExpenseDTO {
    balance: number;
    expenseDay: string;
    salesRepId: number;
    salesRepName: string;
    totalExpenseAmount: number;
    totalAssignedAmount: number;
}

export interface CashSummaryDTO{
    todayCashOut: string;
    cashInHand: string;
    totalSales: string;
    cashOnHand: string;
}