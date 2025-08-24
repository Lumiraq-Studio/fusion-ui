import {Component} from '@angular/core';
import {faArrowUp, faEllipsisV, faSearch, faWallet} from "@fortawesome/free-solid-svg-icons";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PaginationComponent} from "../../../../core";

@Component({
    selector: 'app-payment-view',
    imports: [
        FaIconComponent,
        PaginationComponent
    ],
    templateUrl: './payment-view.component.html',
    standalone: true,
    styleUrl: './payment-view.component.scss'
})
export class PaymentViewComponent {

    protected readonly faSearch = faSearch;
    protected readonly faArrowDown = faArrowDown;
    protected readonly faArrowUp = faArrowUp;
    protected readonly faWallet = faWallet;
    protected readonly faEllipsisV = faEllipsisV;

    searchParams = {
        page_number: 1,
        items_per_page: 10
    }

    pageNumber = 1;
    totalItems: number = 100;
    itemsPerPage: number = 0;

    onPageChange(pageNumber: number) {
        this.searchParams = {
            ...this.searchParams,
            page_number: Number(pageNumber)
        };
    }

    openCashIn() {

    }

    openCashOut() {

    }
}
