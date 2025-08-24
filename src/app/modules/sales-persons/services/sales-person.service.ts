import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {APIRequestResources, CachedAPIRequest, PaginationResponse} from "../../../core";
import {BehaviorSubject, tap} from "rxjs";
import {ProductDetailsDto} from "../../inventory/interfaces/product.entity";
import {toSignal} from "@angular/core/rxjs-interop";
import {take} from "rxjs/operators";
import {SalePersonDTO} from "../interfaces/sales-person.entity";


@Injectable({
    providedIn: 'root'
})
export class SalesPersonService extends CachedAPIRequest {

    $all = new BehaviorSubject<SalePersonDTO[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    $active = new BehaviorSubject<ProductDetailsDto | undefined>(undefined);
    active = toSignal(this.$active, {initialValue: undefined});

    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.SalesPersonService)
        this.find({ rep_name: '',
            status: '',
            page_number: 1,
            items_per_page: 10},true).pipe(take(1)).subscribe()
    }

    find = (searchParams: any, refresh = true) => {
        return this.get<PaginationResponse<SalePersonDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
            )
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

}
