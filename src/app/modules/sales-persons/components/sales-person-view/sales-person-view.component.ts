import {Component, effect, inject, signal} from '@angular/core';
import {faBoxOpen, faEllipsisV, faPeopleCarry, faSearch, faXmark} from '@fortawesome/free-solid-svg-icons';
import {SalesPersonService} from '../../services/sales-person.service';
import {SalesPersonStockService} from '../../services/sales-person-stock.service';
import {ScreenSummaryService} from '../../../shared/services/screen-summary.service';
import {LoadingService, NotificationService, PaginationComponent} from '../../../../core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {SalePersonDTO} from '../../interfaces/sales-person.entity';
import {SalesTeamSummaryDTO} from '../../../shared/interface/screen-summary.entity';
import {NgClass, TitleCasePipe} from '@angular/common';
import {StatusBadgeComponent} from "../../../shared";
import {ProductService} from "../../../inventory/services/product.service";
import {ProductDetailsDto, ProductFindDTO} from "../../../inventory/interfaces/product.entity";
import {FormsModule} from "@angular/forms";
import {types} from "sass";


export interface Variant {
    variantId: number;
    variantStockId: number;
    tempUpdateQty: number;
    variant: string;
    assignedQty: number;
    remainingQty: number;
    repStockId: number;
    soldQty: number | null;
    stockBreakdownId: number;
}

interface Stock {
    productId: number;
    productName: string;
    variants: Variant[];
}

interface SalesRepStockDto {
    salesRepId: number;
    salesRepName: string;
    availableStock: Stock[];
}

@Component({
    standalone: true,
    templateUrl: './sales-person-view.component.html',
    imports: [
        FaIconComponent,
        TitleCasePipe,
        PaginationComponent,
        StatusBadgeComponent,
        FormsModule,
        NgClass
    ],
    styleUrl: './sales-person-view.component.scss'
})
export class SalesPersonViewComponent {


    salesPersonService = inject(SalesPersonService);
    salesPersonStockService = inject(SalesPersonStockService);
    screenSummaryService = inject(ScreenSummaryService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);
    productService = inject(ProductService);

    $$viewStockHistoryModal = signal(false);
    $$createStockModal = signal(false);
    $$SelectedSalesPerson = signal<{ id: number, name: string } | null>(null);
    $$StockAssignHistory = signal(true);
    $$SalesPersonID = signal(0);
    $$ProductID = signal(0);
    $$hasStock = signal(false);

    SalePersonDTOS: SalePersonDTO[] = [];
    SalesRepStock: SalesRepStockDto[] = [];
    salesTeamSummaryDTOS: SalesTeamSummaryDTO[] = [];
    productDetailsDTOS: ProductDetailsDto[] = [];
    AllProducts: ProductFindDTO[] = [];

    searchParams = {
        rep_name: '',
        status: '',
        page_number: 1,
        items_per_page: 10
    };

    repStockParams = {
        rep_id: -1,
        assign_date: ''
    };

    pageNumber = 1;
    totalItems: number = 0;
    updateQty: number = 0;
    newAddedQty: number = 0;
    itemsPerPage: number = 0;
    salesPersonId: number = -1;

    constructor() {
        effect(() => {
            const productDetails = this.productService.active();
            if (productDetails) {
                this.productDetailsDTOS = [productDetails];
                this.filterProductVariants();
            }
            const stat = this.salesPersonStockService.stat();
            if (stat) {
                this.itemsPerPage = stat.itemsPerPage;
                this.pageNumber = stat.pageNumber;
                this.totalItems = stat.totalItems;
            }
            const salesPersons = this.screenSummaryService.salesTeam();
            if (salesPersons) {
                this.salesTeamSummaryDTOS = [salesPersons];
            }
        });
        this.fetchProducts();
    }

    fetchRepStocks() {
        this.loading.set(true);
        this.salesPersonStockService.getStocksHistory(this.repStockParams, true).subscribe({
            next: (res) => {
                this.SalesRepStock = [res.data as unknown as SalesRepStockDto];
                this.$$hasStock.set(!!this.SalesRepStock[0]?.availableStock?.length);
                this.$$viewStockHistoryModal.set(true);
                this.filterProductVariants();
                this.loading.set(false);
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Error fetching stock history:', error);
                this.notification.set({
                    type: 'error',
                    message: 'Failed to fetch stock history',
                    timeout: 4000
                });
                this.$$hasStock.set(false);
            }
        });
    }

    unAssign(stockBreakDownId: number) {
        this.loading.set(true);
        const payload = {
            updatedBy: 'admin',
        };
        this.salesPersonStockService.unassign(stockBreakDownId, payload).subscribe({
            next: (res) => {
                this.loading.set(false);
                this.notification.set({
                    type: 'success',
                    message: 'Stock unassigned successfully.',
                    timeout: 4000
                });
                this.fetchRepStocks();
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Failed to unassign stock:', error);
                this.notification.set({
                    type: 'error',
                    message: 'Failed to unassign stock',
                    timeout: 4000
                });
            }
        });
    }


    updateStock(repStockId: number, stockBreakDownId: number, quantity: number, variantStockId: number) {
        this.loading.set(true);
        const payload = {
            repStockId: repStockId,
            salesRepId: this.$$SalesPersonID(),
            createdBy: 'system',
            breakdowns: [
                {
                    breakdownId: stockBreakDownId,
                    variantStockId: variantStockId,
                    assignedQty: quantity
                }
            ]
        };
        this.salesPersonStockService.create(payload).subscribe({
            next: (res) => {
                this.loading.set(false);
                this.notification.set({
                    type: 'success',
                    message: 'Stock updated successfully.',
                    timeout: 4000
                });
                this.fetchRepStocks();
                this.closeModal()
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Failed to update stock:', error);
                this.notification.set({
                    type: 'error',
                    message: 'Failed to update stock',
                })
            }
        })


    }


    fetchSalesPeople() {
        this.loading.set(true);
        this.salesPersonService.find(this.searchParams, true).subscribe({
            next: (response) => {
                this.SalePersonDTOS = response?.data?.data ?? [];
                this.totalItems = response.data.totalItems;
                this.pageNumber = response.data.page;
                this.itemsPerPage = response.data.itemsPerPage;
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error fetching sales people:', error);
                this.loading.set(false);
            }
        });
    }

    onPageChange(pageNumber: number) {
        this.searchParams = {
            ...this.searchParams,
            page_number: Number(pageNumber)
        };
        this.fetchSalesPeople();
    }

    openCreateModel(id: number) {
        const selectedPerson = this.SalePersonDTOS.find(person => person.id === id);
        if (selectedPerson) {
            this.$$SelectedSalesPerson.set({id: id, name: selectedPerson.name});
            this.$$SalesPersonID.set(id);
        }
        this.$$viewStockHistoryModal.set(true);
        // this.$$createStockModal.set(true);
        this.salesPersonId = id;
        this.repStockParams.rep_id = id;
        this.fetchRepStocks();
    }

    closeModal() {
        this.$$viewStockHistoryModal.set(false);
        this.$$StockAssignHistory.set(false);
        this.$$createStockModal.set(false);
        this.$$hasStock.set(false);
        this.SalesRepStock = [];
        this.updateQty = 0;
        this.productService.initial();
        this.productDetailsDTOS = [];
        this.salesPersonStockService.initial();
        this.$$ProductID.set(0);
        this.$$SalesPersonID.set(0);
        this.$$SelectedSalesPerson.set(null);
    }

    onSalesPersonChange(selectedId: string): void {
        const id = Number(selectedId);
        this.$$SalesPersonID.set(id);
        this.repStockParams.rep_id = id;
        this.$$ProductID.set(0);
        this.updateQty = 0;
        this.productDetailsDTOS = [];
        this.SalesRepStock = [];
        this.$$hasStock.set(false);
        this.salesPersonStockService.initial();
        const selectedPerson = this.SalePersonDTOS.find(person => person.id === id);
        if (selectedPerson) {
            this.$$SelectedSalesPerson.set({id, name: selectedPerson.name});
        } else {
            this.$$SelectedSalesPerson.set(null);
        }
        if (id) {
            this.fetchRepStocks();
        }
    }

    fetchProducts() {
        this.productService.find(this.searchParams, true).subscribe({
            next: (response) => {
                this.AllProducts = response?.data?.data ?? [];
            },
            error: (error) => {
                console.error('Error fetching products:', error);
            }
        });
    }

    onProductSelect(productId: string) {
        const id = Number(productId);
        if (id) {
            this.$$ProductID.set(id);
            this.productDetailsDTOS = [];
            this.productService.getById(String(id), true).subscribe({
                next: (response) => {
                    if (response?.data) {
                        this.productDetailsDTOS = [{
                            ...response.data,
                            variants: response.data.variants.map(variant => ({
                                ...variant,
                                productName: response.data.productName
                            }))
                        }];
                        this.filterProductVariants();
                    }
                    this.loading.set(false);
                },
                error: (error) => {
                    console.error('Error fetching product details:', error);
                    this.loading.set(false);
                }
            });
        } else {
            this.$$ProductID.set(0);
            this.productDetailsDTOS = [];
        }
    }

    filterProductVariants() {
        if (!this.SalesRepStock[0]?.availableStock || !this.productDetailsDTOS.length) {
            return;
        }
        const assignedVariantIds = new Set(
            this.SalesRepStock[0].availableStock
                .flatMap((product: any) => product.variants)
                .map((variant: any) => variant.variantId)
        );

        this.productDetailsDTOS = this.productDetailsDTOS.map(product => ({
            ...product,
            variants: product.variants.map((variant: any) => ({
                ...variant,
                isAssigned: assignedVariantIds.has(variant.variantId)
            }))
        }));
    }

    confirmAssignments() {
        const salesPersonId = this.$$SalesPersonID();
        if (!salesPersonId) {
            this.notification.set({
                type: 'error',
                message: 'Please select a sales person',
                timeout: 4000
            });
            return;
        }

        const assignments = this.productDetailsDTOS.flatMap(product =>
            product.variants
                .filter(variant => variant.newQuantity && variant.newQuantity > 0 && !(variant.isAssigned ?? false))
                .map(variant => ({
                    breakdownId: 0,
                    variantStockId: variant.stockId,
                    assignedQty: variant.newQuantity
                }))
        );

        if (!assignments.length) {
            this.notification.set({
                type: 'error',
                message: 'No valid assignments to confirm',
                timeout: 4000
            });
            return;
        }

        for (const assignment of assignments) {
            const variant = this.productDetailsDTOS
                .flatMap(p => p.variants)
                .find(v => v.stockId === assignment.variantStockId);
            if (variant && Number(assignment.assignedQty) > (variant.availableQTY)) {
                this.notification.set({
                    type: 'error',
                    message: `Quantity for variant ${variant.weight}${variant.unit} exceeds available stock`,
                    timeout: 4000
                });
                return;
            }
            if (isNaN(Number(assignment.assignedQty)) || Number(assignment.assignedQty) < 0 || !Number.isInteger(assignment.assignedQty)) {
                this.notification.set({
                    type: 'error',
                    message: 'Invalid quantity entered',
                    timeout: 4000
                });
                return;
            }
        }

        const payload = {
            repStockId: 0,
            createdBy: 'system',
            salesRepId: salesPersonId,
            breakdowns: assignments
        };

        this.salesPersonStockService.create(payload).subscribe({
            next: (res) => {
                this.loading.set(false);
                this.notification.set({
                    type: 'success',
                    message: 'Stock added successfully.',
                    timeout: 4000
                });
                this.fetchRepStocks();
                this.closeModal()
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Failed to add stock:', error);
                this.notification.set({
                    type: 'error',
                    message: 'Failed to add stock',
                })
            }
        })

    }

    hasValidAssignments(): boolean {
        return this.productDetailsDTOS.some(product =>
            product.variants.some(variant =>
                variant.newQuantity && variant.newQuantity > 0 && !(variant.isAssigned ?? false)
            )
        );
    }

    updateQtyMap: { [key: string]: number } = {};

    getUpdateQty(variantId: number, defaultValue: number): number {
        return this.updateQtyMap[variantId] ?? defaultValue;
    }

    setUpdateQty(variantId: number, value: number): void {
        this.updateQtyMap[variantId] = value;
    }


    protected readonly faBoxOpen = faBoxOpen;
    protected readonly faXmark = faXmark;
    protected readonly faPeopleCarry = faPeopleCarry;
    protected readonly types = types;
    protected readonly Number = Number;
    protected readonly faEllipsisV = faEllipsisV;
    protected readonly faSearch = faSearch;
    protected readonly HTMLInputElement = HTMLInputElement;
}