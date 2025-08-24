export interface SalesTeamSummaryDTO{
    totalSalesPeople: number
    activeMembers: number
    avgMonthlySales: string
    targetAchievementPercentage: string
}
export interface CustomerSummaryDTO{
    totalShops: number;
    newThisMonth: number;
    activePercentage: number;
    inactivePercentage: number;

}