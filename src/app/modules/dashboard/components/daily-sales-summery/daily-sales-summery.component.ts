import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrderService } from "../../../orders/services/order.service";
import { LoadingService, NotificationService } from "../../../../core";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { DecimalPipe } from "@angular/common";

@Component({
    selector: 'app-daily-sales-summery',
    templateUrl: './daily-sales-summery.component.html',
    styleUrls: ['./daily-sales-summery.component.scss'],
    standalone: true,
    imports: [
        FaIconComponent,
        ReactiveFormsModule,
        FormsModule,
        DecimalPipe
    ]
})
export class DailySalesSummeryComponent {
    orderService = inject(OrderService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);

    @Input() isOpen = false;
    @Output() closed = new EventEmitter<void>();

    salesDate = '';

    constructor() {
        this.getSalesSummary();
    }

    getSalesSummary() {
        if (!this.salesDate) {
            const currentDate = new Date();
            this.salesDate = currentDate.toISOString().split('T')[0];
        }
        this.orderService.salesSummary(this.salesDate, true).subscribe();
    }

    close() {
        this.isOpen = false;
        this.closed.emit(); // notify parent
    }

    protected readonly faSearch = faSearch;
    protected readonly faTimes = faTimes;
}
