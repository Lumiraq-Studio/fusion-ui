import {Component, effect, inject, signal} from '@angular/core';
import {LoadingService, NotificationService, PaginationComponent} from "../../../../core";
import {OrderService} from "../../services/order.service";
import {GetOrderDTO} from "../../interfaces/order.entity";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisV, faPlus, faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";
import {OrderCreateModal} from "../order-create-modal/order-create-modal.component";
import {SalesPersonService} from "../../../sales-persons/services/sales-person.service";
import {TitleCasePipe} from "@angular/common";
import {StatusBadgeComponent} from "../../../shared";
import {OrderSummeryPanelComponent} from "../order-summery-panel/order-summery-panel.component";
import {OrderViewModalComponent} from "../order-view-modal/order-view-modal.component";
import {RouteService} from "../../../routes/services/routes.service";

@Component({
    selector: 'app-order-view',
    imports: [
        PaginationComponent,
        FormsModule,
        FaIconComponent,
        ReactiveFormsModule,
        OrderCreateModal,
        StatusBadgeComponent,
        TitleCasePipe,
        OrderSummeryPanelComponent,
        OrderViewModalComponent
    ],
    templateUrl: './order-view.component.html',
    standalone: true,
    styleUrl: './order-view.component.scss'
})
export class OrderViewComponent {

    protected readonly faSearch = faSearch;
    protected readonly faEllipsisV = faEllipsisV;
    protected readonly faPlus = faPlus;
    protected readonly faXmark = faXmark;

    orderService = inject(OrderService);
    notification = inject(NotificationService);
    loading = inject(LoadingService);
    salesPersonService = inject(SalesPersonService);
    routeService = inject(RouteService)
    GetOrderDTOS: GetOrderDTO[] = []

    $$orderCreate = signal(false);
    $$orderDetail = signal(false);


    pageNumber = 1;
    totalItems: number = 100;
    itemsPerPage: number = 0;


    searchParams = {
        order_type: '',
        order_date: '',
        order_status: '',
        order_reference: '',
        shop_name: '',
        sales_rep_name: '',
        payment_type: '',
        route_id: -1,
        page_number: 1,
        items_per_page: 10
    }

    constructor() {
        effect(() => {
            const order = this.orderService.active();
            if (order) {
                this.GetOrderDTOS = [order]
            }
        });
    }

    searchOrder() {
        this.fetchOrders()
    }

    onRouteChange(event: any) {
        this.searchParams.route_id = Number(event.target.value);
        // this.routeId = Number(event.target.value);
    }

    fetchOrders() {
        this.loading.set(true);
        this.orderService.find(this.searchParams, true).subscribe({
            next: (response) => {
                this.totalItems = response.data.totalItems;
                this.pageNumber = response.data.page;
                this.itemsPerPage = response.data.itemsPerPage;
                this.loading.set(false);
            },
            error: (error) => {
                this.loading.set(false);
                console.error(error);
            }
        });
    }

    onPageChange(pageNumber: number) {
        this.searchParams = {
            ...this.searchParams,
            page_number: Number(pageNumber)
        };
        this.fetchOrders();
    }

    handleClick(id: number) {
        this.orderService.getById(String(id), true).subscribe();
        this.$$orderDetail.set(true)
    }

    clearSearch() {
        this.searchParams.payment_type = ''
        this.searchParams.sales_rep_name = ''
        this.searchParams.order_status = ''
        this.searchParams.order_reference = ''
        this.searchParams.order_date = ''
        this.fetchOrders()
    }


}
