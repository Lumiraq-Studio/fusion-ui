import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, take, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {APIRequestResources, CachedAPIRequest, PaginationResponse} from "../../../core";
import {CustomerCreateDTO} from "../../customers/interfaces/customers.entity";
import {VariantDTO} from "../interface/productVariant.entity";


@Injectable({
  providedIn: 'root'
})
export class VariantService extends CachedAPIRequest {

  $all = new BehaviorSubject<VariantDTO[]>([]);
  all = toSignal(this.$all, {initialValue: []});


  $active = new BehaviorSubject<CustomerCreateDTO | undefined>(undefined);
  active = toSignal(this.$active, {initialValue: undefined});

  constructor(protected override http: HttpClient) {
    super(http, APIRequestResources.VariantService)
    this.find({
      search_term: '',
      weight: -1,
      page_number: 1,
      items_per_page: -1
    }).pipe(take(1)).subscribe()
  }

  find = (searchParams: any, refresh = false) => {
    return this.get<PaginationResponse<VariantDTO[]>>({
      endpoint: `find`,
      params: searchParams,
    }, refresh ? 'freshness' : 'performance')
        .pipe(
            tap((res) => this.$all.next(res.data.data)),
        )
  }

  getById = (id: string, refresh = false) => {
    return this.get<CustomerCreateDTO>({id}, refresh ? 'freshness' : 'performance')
        .pipe(tap((res) => this.$active.next(res.data)),);
  }

  create = (product: any) => {
    return this.post<any>(product, {}).pipe(
    );
  }

  update = (id: number, customer: any) => {
    const options = {suffix: id.toString()};
    return this.patch<any>(customer, options).pipe(
    );
  }

  updateBase = (id: number, payload: any) => {
    const options = { suffix: id.toString(), endpoint: `base-price/` };
    return this.patch<any>(payload, options).pipe(
    );
  }


}
