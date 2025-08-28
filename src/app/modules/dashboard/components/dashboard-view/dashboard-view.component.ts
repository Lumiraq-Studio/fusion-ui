import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlus, faSearch} from "@fortawesome/free-solid-svg-icons";
import {OrderService} from "../../../orders/services/order.service";
import {LoadingService, NotificationService} from "../../../../core";
import {FormsModule} from "@angular/forms";
import {DailySalesSummeryComponent} from "../daily-sales-summery/daily-sales-summery.component";


@Component({
    selector: 'app-dashboard-view',
    imports: [
        FaIconComponent,
        FormsModule,
        DailySalesSummeryComponent
    ],
    templateUrl: './dashboard-view.component.html',
    standalone: true,
    styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {



}
