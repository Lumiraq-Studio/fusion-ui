import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, finalize, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {APIRequestResources, CachedAPIRequest, LoadingService, PaginationResponse} from "../../../core";
import {CustomerCreateDTO, CustomerFindDTO} from "../interfaces/customers.entity";
import {take} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class CustomerService extends CachedAPIRequest {

    $all = new BehaviorSubject<CustomerFindDTO[]>([]);
    all = toSignal(this.$all, {initialValue: []});


    $active = new BehaviorSubject<CustomerCreateDTO | undefined>(undefined);
    active = toSignal(this.$active, {initialValue: undefined});

   private loading = inject(LoadingService);

    constructor(protected override http: HttpClient, private router: Router) {
        super(http, APIRequestResources.CustomerService)
        // this.find({
        //     shop_code: '',
        //     short_name: '',
        //     full_name: '',
        //     type: -1,
        //     route: -1,
        //     page_number: 1,
        //     items_per_page: 10
        // },true).pipe(take(1)).subscribe()
    }

    find = (searchParams: any, refresh = true) => {
        this.loading.set(true);
        return this.get<PaginationResponse<CustomerFindDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
                finalize(() => this.loading.set(false))
            );
    }


    getById = (id: string, refresh = false) => {
        return this.get<CustomerCreateDTO>({id}, refresh ? 'freshness' : 'performance')
            .pipe(tap((res) => this.$active.next(res.data)),);
    }

    create = (customer: any) => {
        return this.post<any>(customer, {}).pipe(
            tap(() => {
                this.$all.next([])
            })
        );
    }

    update = (id: number, customer: any) => {
        const options = {suffix: id.toString()};
        return this.patch<any>(customer, options).pipe(
            tap(() => {

            })
        );
    }

}
