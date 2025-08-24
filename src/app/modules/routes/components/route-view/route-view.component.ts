import {Component, effect, inject, signal} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisV, faPlus, faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";
import {PaginatedRoutesDTO, RouteCreateDTO} from "../../interfaces/route.entity";
import {RouteService} from "../../services/routes.service";
import {TitleCasePipe} from "@angular/common";
import {LoadingService, NotificationService, PaginationComponent} from "../../../../core";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-route-view',
    imports: [
        FaIconComponent,
        TitleCasePipe,
        PaginationComponent,
        FormsModule
    ],
    templateUrl: './route-view.component.html',
    standalone: true,
    styleUrl: './route-view.component.scss'
})
export class RouteViewComponent {

    protected readonly faSearch = faSearch;
    protected readonly faPlus = faPlus;
    protected readonly faEllipsisV = faEllipsisV;
    protected readonly faXmark = faXmark;


    routeService = inject(RouteService)
    loading = inject(LoadingService);
    notification = inject(NotificationService);

    $$CreateModal = signal(false)
    $$RouteID = signal(0);
    $$UpdateMode = signal(false)

    routesResultDTOS: PaginatedRoutesDTO[] = []

    pageNumber = 1;
    totalItems: number = 0;
    itemsPerPage: number = 0;


    searchParams = {
        route_name: '',
        area_name: '',
        page_number: 1,
        items_per_page: 10
    }

    route: RouteCreateDTO = {
        area: '', name: ''
    }

    constructor() {
        effect(() => {
            this.routesResultDTOS = this.routeService.allRoutes()
        });
    }

    fetchRoutes() {
        this.loading.set(true);
        this.routeService.paginatedRoutes(this.searchParams, true).subscribe({
            next: (response) => {
                this.routesResultDTOS = response?.data?.data ?? [];
                this.totalItems = response.data.totalItems;
                this.pageNumber = response.data.page;
                this.itemsPerPage = response.data.itemsPerPage;
                this.loading.set(false);
            },
        });
    }

    CreateRoute() {
        if (!this.isFormValid()) return;

        this.loading.set(true);

        const routeId = this.$$RouteID();
        const isUpdateMode = routeId > 0;

        const submitAction = isUpdateMode
            ? this.routeService.update(routeId, this.route)
            : this.routeService.create(this.route);

        submitAction.subscribe({
            next: () => {
                const action = isUpdateMode ? 'updated' : 'created';
                this.notification.set({
                    type: 'success',
                    message: `Route ${this.route.name} has been ${action} successfully.`,
                });

                this.loading.set(false);
                this.fetchRoutes();
                this.closeModal();
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);

                const action = isUpdateMode ? 'updated' : 'created';
                this.notification.set({
                    type: 'error',
                    message: `Failed to ${action} route.`,
                });
            }
        });
    }

    onPageChange(pageNumber: number) {
        this.searchParams = {
            ...this.searchParams,
            page_number: Number(pageNumber)
        };
        this.fetchRoutes();
    }

    isFormValid(): boolean {
        return (
            this.route.name.trim().length >= 3 &&
            this.route.area.trim().length >= 3
        );
    }

    openUpdateModal(route: PaginatedRoutesDTO) {
        this.$$RouteID.set(route.id);
        this.route = {
            name: route.name,
            area: route.area
        };
        this.$$UpdateMode.set(true);
        this.$$CreateModal.set(true);
    }

    closeModal() {
        this.$$CreateModal.set(false);
        this.route = {
            name: '',
            area: '',
        };
        this.$$UpdateMode.set(false);
    }

}
