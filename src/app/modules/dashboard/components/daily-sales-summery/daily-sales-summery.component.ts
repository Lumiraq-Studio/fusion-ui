import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OrderService} from "../../../orders/services/order.service";
import {LoadingService, NotificationService} from "../../../../core";
import {faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-daily-sales-summery',
    imports: [
        FaIconComponent,
        ReactiveFormsModule,
        FormsModule,
        DecimalPipe
    ],
  templateUrl: './daily-sales-summery.component.html',
  styleUrl: './daily-sales-summery.component.scss'
})
export class DailySalesSummeryComponent {

    orderService = inject(OrderService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);
    
    isOpen = false;

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
    protected readonly faTimes = faTimes;
}
