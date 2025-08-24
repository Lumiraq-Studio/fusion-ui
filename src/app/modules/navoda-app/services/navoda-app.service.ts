import {Injectable} from "@angular/core";
import {APIRequestResources, CachedAPIRequest, PaginationResponse} from "../../../core";
import {BehaviorSubject, take, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApkDTO} from "../interface/apk.entity";


@Injectable({
    providedIn: 'root'
})
export class ApkService extends CachedAPIRequest {

    private readonly $all = new BehaviorSubject<ApkDTO[]>([])
    all = toSignal(this.$all, {initialValue: []})

    private readonly $statistics = new BehaviorSubject<any>(undefined)
    stat = toSignal(this.$statistics, {initialValue: undefined})

    constructor(protected override http: HttpClient, private router: Router) {
        super(http, APIRequestResources.ApkService)
        this.find({
            apk_version: '', apk_platform: '',apk_status:'', page_number: 1, items_per_page: 10
        },true).pipe(take(1)).subscribe()
    }

    find = (searchParams: any, refresh = true) => {
        return this.get<PaginationResponse<ApkDTO[]>>({
            endpoint: `find`,
            params: searchParams,
        }, refresh ? 'freshness' : 'performance')
            .pipe(
                tap((res) => this.$all.next(res.data.data)),
                tap((res) => {
                    const {data, ...obj} = res.data
                    this.$statistics.next(obj)
                })
            )
    }


}