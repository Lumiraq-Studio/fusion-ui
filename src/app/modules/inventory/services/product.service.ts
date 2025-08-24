import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, finalize, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {take} from "rxjs/operators";
import {APIRequestResources, CachedAPIRequest, LoadingService, PaginationResponse} from "../../../core";
import {ProductDetailsDto, ProductFindDTO} from "../interfaces/product.entity";
import {ProductPriceDTO} from "../interfaces/product-price.entity";


@Injectable({
    providedIn: 'root'
})
export class ProductService extends CachedAPIRequest {

    $all = new BehaviorSubject<ProductFindDTO[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    $active = new BehaviorSubject<ProductDetailsDto | undefined>(undefined);
    active = toSignal(this.$active, {initialValue: undefined});

    $prices = new BehaviorSubject<ProductPriceDTO | undefined>(undefined);
    prices = toSignal(this.$prices, {initialValue: undefined});

    private loading = inject(LoadingService);

    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.ProductService)
        this.find({
            product_name: '',
            warehouse_code: '',
            page_number: 1,
            items_per_page: -1
        }, true).pipe(take(1)).subscribe()
    }

    find = (searchParams: any, refresh = true) => {
        this.loading.set(true);
        return this.get<PaginationResponse<ProductFindDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
                finalize(() => this.loading.set(false))
            );
    }

    create = (product: any) => {
        return this.post<any>(product, {}).pipe(
            tap(() => {
                this.$all.next([])
            })
        );
    }

    update = (id: number, product: any) => {
        const options = {suffix: id.toString()};
        return this.patch<any>(product, options).pipe(
            tap(() => {

            })
        );
    }

    getById = (id: string, refresh = true) => {
        return this.get<ProductDetailsDto>({id}, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$active.next(res.data)),
            );
    }


    getPrice = (searchParams: any, refresh = true) => {
        return this.get<ProductPriceDTO>({
            endpoint: `price`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$prices.next(res.data)),
            );
    }

    initial = () => {
        this.$active.next(undefined)
    }

}
