import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {APIRequestResources, CachedAPIRequest} from "../../../core";


@Injectable({
    providedIn: 'root'
})
export class VariantStock extends CachedAPIRequest {

    constructor(protected override http: HttpClient) {
        super(http, APIRequestResources.VariantStock)
    }

    create = (product: any) => {
        return this.post<any>(product, {}).pipe(
        );
    }

    update = (id: number, product: any) => {
        const options = {suffix: id.toString()};
        return this.patch<any>(product, options).pipe(
        );
    }

}
