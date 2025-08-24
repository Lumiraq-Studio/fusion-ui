import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {take} from "rxjs/operators";
import {APIRequestResources, CachedAPIRequest, PaginationResponse} from "../../../core";
import {PaymentMethod} from "../interfaces/payments.entity";


@Injectable({
    providedIn: 'root'
})
export class PaymentMethodsService extends CachedAPIRequest {

    $all = new BehaviorSubject<PaymentMethod[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.PaymentTermsService)
        this.find({
            type: '', page_number: 1,
            items_per_page: -1
        }).pipe(take(1)).subscribe()
    }

    find = (searchParams: any, refresh = true) => {
        return this.get<PaginationResponse<PaymentMethod[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
            );
    }

}
