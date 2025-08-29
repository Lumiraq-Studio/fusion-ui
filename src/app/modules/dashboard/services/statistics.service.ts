import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {APIRequest, APIRequestResources} from "../../../core";
import {BaseStatistics, MonthlyPerformanceItem, SalesWeekItem} from "../interface/sales-summary.entity";



@Injectable({
    providedIn: 'root'
})
export class StatisticsService extends APIRequest {

    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.StatisticsService);
    }

    baseStatistics() {
        return this.get<BaseStatistics>({
            endpoint: 'base',
        });
    }

    salesWeek() {
        return this.get<SalesWeekItem[]>({
            endpoint: 'sales-week',
        });
    }

    monthlyPerformance() {
        return this.get<MonthlyPerformanceItem[]>({
            endpoint: 'monthly-performance',
        });
    }
}
