import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, tap} from "rxjs";

import {toSignal} from "@angular/core/rxjs-interop";
import {APIRequestResources, CachedAPIRequest, PaginationResponse} from "../../../core";
import {FindRoutesDTO, PaginatedRoutesDTO,} from "../interfaces/route.entity";
import {take} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class RouteService extends CachedAPIRequest {

    $all = new BehaviorSubject<FindRoutesDTO[]>([]);
    all = toSignal(this.$all, {initialValue: []});

    $allRoutes = new BehaviorSubject<FindRoutesDTO[]>([]);
    allRoutes = toSignal(this.$allRoutes, {initialValue: []});

    constructor(protected override http: HttpClient, private router: Router) {
        super(http, APIRequestResources.RouteService)
        this.find({
            route_name: '', area_name: '', page_number: 1, items_per_page: -1
        }).pipe(take(1)).subscribe()
    }

    paginatedRoutes = (searchParams: any, refresh = false) => {
        return this.get<PaginationResponse<PaginatedRoutesDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$allRoutes.next(res.data.data)),
            )
    }

    find = (searchParams: any, refresh = false) => {
        return this.get<PaginationResponse<FindRoutesDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
            )
    }

    create = (route: any) => {
        return this.post<any>(route, {}).pipe(
            tap(() => {
                this.$all.next([])
            })
        );
    }

    update = (id: number, route: any) => {
        const options = {suffix: id.toString()};
        return this.patch<any>(route, options).pipe(
            tap(() => {

            })
        );
    }
}
