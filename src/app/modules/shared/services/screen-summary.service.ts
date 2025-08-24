import {Injectable} from "@angular/core";
import {APIRequestResources, CachedAPIRequest} from "../../../core";
import {HttpClient} from "@angular/common/http";
import {CustomerSummaryDTO, SalesTeamSummaryDTO} from "../interface/screen-summary.entity";
import {BehaviorSubject, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {take} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ScreenSummaryService extends CachedAPIRequest {


    $customer = new BehaviorSubject<CustomerSummaryDTO | undefined>(undefined);
    customer = toSignal(this.$customer, {initialValue: undefined});

    $salesTeam = new BehaviorSubject<SalesTeamSummaryDTO | undefined>(undefined);
    salesTeam = toSignal(this.$salesTeam, {initialValue: undefined});


    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.ScreenSummaryService)
        this.getCustomerSummary(true).pipe(take(1)).subscribe();
        this.getSalesTeamSummary(true).pipe(take(1)).subscribe();
    }

    getCustomerSummary = (refresh = false) => {
        return this.get<CustomerSummaryDTO>({endpoint:'customers'}, refresh ? 'freshness' : 'performance')
            .pipe(tap((res) => this.$customer.next(res.data)),);
    }

    getSalesTeamSummary = ( refresh = false) => {
        return this.get<SalesTeamSummaryDTO>({endpoint:'sales-team'}, refresh ? 'freshness' : 'performance')
            .pipe(tap((res) => this.$salesTeam.next(res.data)),);
    }

}