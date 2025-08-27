import {inject, Injectable} from "@angular/core";
import {APIRequestResources, CachedAPIRequest, LoadingService} from "../../../core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, finalize, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {SalesRepStockFind, SalesRepStockGet, ViewRepStockDTO} from "../interfaces/sales-person-stock.entity";
import {SalesRepStockDto} from "../interfaces/sales-person.entity";


@Injectable({
    providedIn: 'root'
})
export class SalesPersonStockService extends CachedAPIRequest {


    $all = new BehaviorSubject<SalesRepStockFind[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    $active = new BehaviorSubject<SalesRepStockGet | undefined>(undefined);
    active = toSignal(this.$active, {initialValue: undefined});

    $stocks = new BehaviorSubject<SalesRepStockDto[]>([]);
    stocks = toSignal(this.$stocks, {initialValue: []});

    $repStock = new BehaviorSubject<ViewRepStockDTO | undefined>(undefined);
    repStock = toSignal(this.$repStock, {initialValue: undefined});


    private readonly $statistics = new BehaviorSubject<any>(undefined)
    stat = toSignal(this.$statistics, {initialValue: undefined})

    private loading = inject(LoadingService);

    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.SalesPersonStockService)
    }

    getStocksHistory = (searchParams: any, refresh = true) => {
        this.loading.set(true);
        return this.get<SalesRepStockDto[]>({
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                finalize(() => this.loading.set(false))
            );
    }


    getById = (id: string, refresh = false) => {
        return this.get<SalesRepStockGet>({id}, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$active.next(res.data)),
            );
    }

    create = (repStocks: any) => {
        return this.post<any>(repStocks, {}).pipe();
    }

    getByRepId = (id: string, refresh = true) => {
        return this.get<ViewRepStockDTO>({
            endpoint: `by-rep/${id}`,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$repStock.next(res.data)),
            );
    }

    unassign(id: number, payload: any) {
        // const options = {endpoint: `${id}`};
        // return this.patch<any>(payload, options);
        const options = {suffix: id.toString()};
        return this.patch<any>(payload, options);

    }

    initial = () => {
        this.$all.next([])
    }
}