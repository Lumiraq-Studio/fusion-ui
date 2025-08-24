import {Component, effect, inject, signal} from '@angular/core';
import {LoadingService, NotificationService, PaginationComponent} from "../../../../core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisV, faPlus, faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";
import {CustomerService} from "../../services/customers.service";
import {CustomerCreateDTO, CustomerFindDTO} from "../../interfaces/customers.entity";
import {TitleCasePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {catchError, concatMap, first, from, of} from "rxjs";
import {map} from "rxjs/operators";
import {RouteService} from "../../../routes/services/routes.service";
import {FindRoutesDTO} from "../../../routes/interfaces/route.entity";
import {routes} from "../../../../app.routes";
import {VariantService} from "../../../shared/services/product-variant.service";
import {VariantDTO} from "../../../shared/interface/productVariant.entity";
import {ScreenSummaryService} from "../../../shared/services/screen-summary.service";
import {CustomerSummaryDTO} from "../../../shared/interface/screen-summary.entity";
import {StatusBadgeComponent} from "../../../shared";
import {AuthenticationService} from "../../../../core/modules/authentication/service/authentication.service";

interface ProductPrice {
    id: number;
    name: string;
    prices: { [key: number]: number };
}

@Component({
    selector: 'app-customer-view',
    imports: [
        PaginationComponent,
        FaIconComponent,
        FormsModule,
        TitleCasePipe,
        ReactiveFormsModule,
        StatusBadgeComponent,
    ],
    templateUrl: './customer-view.component.html',
    standalone: true,
    styleUrl: './customer-view.component.scss'
})
export class CustomerViewComponent {

    protected readonly faEllipsisV = faEllipsisV
    protected readonly faPlus = faPlus;
    protected readonly faSearch = faSearch;
    protected readonly faXmark = faXmark;
    protected readonly routes = routes;

    customerService = inject(CustomerService)
    variantService = inject(VariantService)
    routeService = inject(RouteService)
    notification = inject(NotificationService);
    loading = inject(LoadingService);
    authService = inject(AuthenticationService);
    screenSummaryService = inject(ScreenSummaryService);

    $$CreateModal = signal(false)
    $$PricesModal = signal(false)
    $$UpdateMode = signal(false)
    $$CusID = signal(0);

    customerDataDTOS: CustomerFindDTO[] = []
    routesResultDTOS: FindRoutesDTO[] = []
    variantResultDTOS: VariantDTO[] = []
    customerSummaryDTOS: CustomerSummaryDTO[] = []

    searchTerm = '';

    pageNumber = 1;
    totalItems: number = 0;
    itemsPerPage: number = 0;

    searchParams = {
        shop_code: '',
        short_name: '',
        full_name: '',
        type: -1,
        route: -1,
        page_number: 1,
        items_per_page: 10
    }


    customer: CustomerCreateDTO = {
        fullName: '', shortName: '', address: '', status: '',
        mobile: '', routeId: '', createdBy: this.authService.$$LoggedUserID()
    }


    constructor() {
        effect(() => {
            this.routesResultDTOS = this.routeService.all();
            this.customerDataDTOS = this.customerService.all();
            console.log(this.customerDataDTOS)
            this.variantResultDTOS = this.variantService.all()
        });
        effect(() => {
            const customerSummary = this.screenSummaryService.customer()
            if (customerSummary) {
                this.customerSummaryDTOS.push(customerSummary)

            }
        }),
        effect(() => {
            const customer = this.customerService.active()
            if (customer) {
                this.$$UpdateMode.set(true)
                this.customer={
                    ...customer
                }
            }
        })
    }

    onPageChange(pageNumber: number) {
        this.searchParams = {
            ...this.searchParams,
            page_number: Number(pageNumber)
        };
        this.fetchCustomers();
    }


    fetchCustomers() {
        this.loading.set(true);

        const searchTerms = [
            {field: 'full_name', value: this.searchTerm},
            {field: 'short_name', value: this.searchTerm},
            {field: 'shop_code', value: this.searchTerm}
        ];

        const baseConfig = {
            page_number: this.searchParams.page_number,
            items_per_page: this.searchParams.items_per_page,
            route: this.searchParams.route
        };

        from(searchTerms).pipe(
            concatMap(searchTerm => {
                const config = {
                    ...baseConfig,
                    [searchTerm.field]: searchTerm.value
                };

                return this.customerService.find(config, true).pipe(
                    map(response => ({
                        data: response?.data?.data || [],
                        totalItems: response?.data?.totalItems || 0,
                        itemsPerPage: response?.data?.itemsPerPage || 0,
                        pageNumber: response?.data?.page || 0
                    }))
                );
            }),
            first(results => results.data.length > 0),
            catchError(error => {
                this.loading.set(false);
                console.error(error);
                return of({
                    data: [],
                    totalItems: 0,
                    itemsPerPage: 0,
                    pageNumber: 0
                });
            })
        ).subscribe({
            next: ({data, totalItems, itemsPerPage, pageNumber}) => {
                this.customerDataDTOS = data;
                this.totalItems = totalItems;
                this.itemsPerPage = itemsPerPage;
                this.pageNumber = pageNumber;
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                console.error('Error fetching customers:', err);
            }
        });
    }


    CreateCustomer() {
        if (!this.isFormValid()) return;
        this.loading.set(true);

        const submitAction = this.$$UpdateMode()
            ? this.customerService.update(this.$$CusID(), this.customer)
            : this.customerService.create(this.customer);

        submitAction.subscribe({
            next: () => {
                const action = this.$$UpdateMode() ? 'updated' : 'created';
                this.notification.set({
                    type: 'success',
                    message: `Customer ${this.customer.fullName} has been ${action} successfully.`,
                });
                this.loading.set(false);
                this.fetchCustomers()
                this.closeModal();
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
                const action = this.$$UpdateMode() ? 'updated' : 'created';
                this.notification.set({
                    type: 'error',
                    message: `Failed to ${action} customer.`,
                });
            }
        });
    }

    handleClick(customerID: number) {
        this.$$CusID.set(customerID);
        this.$$UpdateMode.set(true);
        this.customerService.getById(String(this.$$CusID()), true).subscribe();
    }

    isFormValid(): boolean {
        return !!(
            this.customer.fullName?.trim().length >= 3 &&
            this.customer.routeId
        );
    }

    closeModal() {
        this.$$CreateModal.set(false);
        this.customer = {
            fullName: '', shortName: '', address: '', mobile: '', routeId: '', status: '',
        };
        this.$$UpdateMode.set(false);
    }


    closePricesModal() {

    }

    savePrices() {

    }
}
