import {Injectable} from "@angular/core";
import {APIRequestResources, CachedAPIRequest} from "../../../core";
import {BehaviorSubject, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {HttpClient} from "@angular/common/http";
import {PriceDTO, SalesReportDTO} from "../interfaces/report.entity";


@Injectable({
    providedIn: 'root'
})
export class ReportsService extends CachedAPIRequest {

    $all = new BehaviorSubject<SalesReportDTO[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    $price = new BehaviorSubject<PriceDTO[]>([]);
    price = toSignal(this.$price, {initialValue: []});


    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.ReportsService)
    }


    salesReport = (searchParams: any, refresh = true) => {
        return this.get<SalesReportDTO[]>({
            endpoint: `download`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data)),
            )
    }

    priceReport = (priceId: any, refresh = true) => {
        return this.get<PriceDTO[]>({
            endpoint: `price/${priceId}`
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$price.next(res.data)),
            )
    }

}
