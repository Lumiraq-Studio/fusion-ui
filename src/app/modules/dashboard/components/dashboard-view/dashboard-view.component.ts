import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlus, faSearch} from "@fortawesome/free-solid-svg-icons";
import {OrderService} from "../../../orders/services/order.service";
import {LoadingService, NotificationService} from "../../../../core";
import {FormsModule} from "@angular/forms";
import {TitleCasePipe} from "@angular/common";


@Component({
    selector: 'app-dashboard-view',
    imports: [
        FaIconComponent,
        FormsModule
    ],
    templateUrl: './dashboard-view.component.html',
    standalone: true,
    styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {


    orderService = inject(OrderService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);

    constructor() {
        this.getSalesSummary()
    }

    salesDate = ''

    getSalesSummary() {
        if (!this.salesDate) {
            const currentDate = new Date();
            this.salesDate = currentDate.toISOString().split('T')[0];
        }
        this.orderService.salesSummary(this.salesDate, true).subscribe();
    }


    protected readonly faSearch = faSearch;
    protected readonly faPlus = faPlus;

}
