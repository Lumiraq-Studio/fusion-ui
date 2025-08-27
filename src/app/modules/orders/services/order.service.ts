import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, finalize, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {take} from "rxjs/operators";
import {FindOrderDTO, GetOrderDTO} from "../interfaces/order.entity";
import {APIRequestResources, CachedAPIRequest, LoadingService, PaginationResponse} from "../../../core";
import {SalesSummaryDTO} from "../../dashboard/interface/sales-summary.entity";


@Injectable({
    providedIn: 'root'
})
export class OrderService extends CachedAPIRequest {

    $all = new BehaviorSubject<FindOrderDTO[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    $summary = new BehaviorSubject<SalesSummaryDTO[]>([]);
    summary = toSignal(this.$summary, {initialValue: []});

    $active = new BehaviorSubject<GetOrderDTO | undefined>(undefined);
    active = toSignal(this.$active, {initialValue: undefined});

    private loading = inject(LoadingService);

    constructor(protected override http: HttpClient, private router: Router) {
        super(http, APIRequestResources.OrderService)
    }

    find = (searchParams: any, refresh = true) => {
        this.loading.set(true);
        return this.get<PaginationResponse<FindOrderDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
                finalize(() => this.loading.set(false))
            );
    }


    getById = (id: string, refresh = false) => {
        return this.get<GetOrderDTO>({id}, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$active.next(res.data)),
            );
    }

    create=(createOrders:any)=>{
        return this.post<any>(createOrders, {}).pipe(
            tap(() => {
                this.$all.next([])
            }),tap(()=>{
                this.find({
                    order_type:'',
                    order_date: '',
                    order_reference: '',
                    shop_name: '',
                    sales_rep_name: '',
                    payment_type: '',
                    route_id: -1,
                    page_number: 1,
                    items_per_page: 10
                }).pipe(take(1)).subscribe()
            })
        );
    }

    initial = () => {
        this.$active.next(undefined)
    }

    salesSummary = (dateValue: any, refresh = true) => {
        return this.get<SalesSummaryDTO[]>({
            endpoint: `summary/${dateValue}`
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$summary.next(res.data)),
            )
    }

}
