import {Component, effect, inject, signal} from '@angular/core';
import {faEdit, faExclamationCircle, faEye, faPlus, faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LoadingService, NotificationService} from "../../../../core";
import {TitleCasePipe, UpperCasePipe} from "@angular/common";
import {ProductService} from "../../services/product.service";
import {ProductCreateDTO, ProductDetailsDto, ProductFindDTO, StockCreateDto,} from "../../interfaces/product.entity";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VariantCreateDTO} from "../../../shared/interface/productVariant.entity";
import {PriceService} from "../../services/price.service";
import {VariantService} from "../../../shared/services/product-variant.service";
import {VariantStock} from "../../services/variant-stock.service";
import {CustomerService} from "../../../customers/services/customers.service";
import {CustomerFindDTO} from "../../../customers/interfaces/customers.entity";
import {CustomerSearchComponent, StatusBadgeComponent} from "../../../shared";
import {AuthenticationService} from "../../../../core/modules/authentication/service/authentication.service";

@Component({
    selector: 'app-inventory-view',
    imports: [
        FaIconComponent,
        ReactiveFormsModule,
        FormsModule,
        TitleCasePipe,
        UpperCasePipe,
        CustomerSearchComponent,
        StatusBadgeComponent
    ],
    templateUrl: './inventory-view.component.html',
    standalone: true,
    styleUrl: './inventory-view.component.scss'
})
export class InventoryViewComponent {

    protected readonly faSearch = faSearch;
    protected readonly faPlus = faPlus;
    protected readonly faEye = faEye;
    protected readonly faXmark = faXmark;
    protected readonly faEdit = faEdit;

    productService = inject(ProductService)
    loading = inject(LoadingService);
    notification = inject(NotificationService);
    authService = inject(AuthenticationService);
    priceService = inject(PriceService);
    variantService = inject(VariantService);
    variantStock = inject(VariantStock);
    customerService = inject(CustomerService);

    $$CreateModal = signal(false)
    $$DetailsModal = signal(false)
    $$StockUpdateModal = signal(false)
    $$ProductID = signal(0);
    $$UpdateMode = signal(false)
    $$globalPrice = signal(0);
    $$VariantID = signal(0);
    $$customerId = signal(0);


    selectedVariant: any = '';
    enableField = false;
    enableCustomField = false;


    AllProducts: ProductFindDTO[] = []
    productDetailsDTOS: ProductDetailsDto[] = []
    customersDTO: CustomerFindDTO[] = []

    searchParams = {
        page_number: 1,
        items_per_page: 10
    }

    pageNumber = 1;
    totalItems: number = 0;
    itemsPerPage: number = 0;


    product: ProductCreateDTO = {
        productName: '', description: '', warehouseId: 1,
        createdBy: 'sadee'
    }

    stock: StockCreateDto = {
        basePrice: 0, stockQty: 0, variantId: 0, warehouseId: 0,
        createdBy: this.authService.$$LoggedUserID()
    }

    stockCreateDTO = {
        stockId: -1, stockQty: 0, variantId: this.$$VariantID(), warehouseId: 1,
        createdBy: this.authService.$$LoggedUserID()
    }

    price = {
        priceValue: 0, variantId: 0,
    }

    variant: VariantCreateDTO = {
        basePrice: 0, cost: 0, productId: this.$$ProductID(), unit: "", weight: 0,
        productName: '', createdBy: this.authService.$$LoggedUserID()
    }

    variantPrice = {
        weight: 0,
        currentCost: 0,
        currentPrice: 0,
        updatedBy: '',
        basePrice: 0.00,
        cost: 0.00
    }


    onShopSelected(shop: any) {
        this.loading.set(true);
        this.$$customerId.set(shop.id);
        this.loading.set(false);
    }

    constructor() {
        effect(() => {
            const productDetails = this.productService.active()
            if (productDetails) {
                this.productDetailsDTOS.push(productDetails)
            }
        });
        effect(() => {
            this.AllProducts = this.productService.all()
        });
        effect(() => {
            this.customersDTO = this.customerService.all()
        });
    }

    fetchProductDetails(product: ProductFindDTO) {
        this.$$ProductID.set(product.id);
        this.productService.getById(String(this.$$ProductID()), true).subscribe(
            {
                next: (res) => {
                    if (res.data) {
                        this.$$DetailsModal.set(true)
                    }

                }
            }
        )
    }

    fetchProducts() {
        this.loading.set(true);
        this.productService.find(this.searchParams, true).subscribe({
            next: (response) => {
                this.AllProducts = response?.data?.data ?? [];
                this.totalItems = response.data.totalItems;
                this.pageNumber = response.data.page;
                this.itemsPerPage = response.data.itemsPerPage;
                this.loading.set(false);
            },
            error: (error) => {
                this.loading.set(false);
                console.error(error);
                this.notification.set({
                    type: 'error',
                    message: 'Failed to fetch Products',
                    timeout: 4000
                });
            }
        });
    }

    CreateProduct() {
        if (!this.isFormValid()) return;
        this.loading.set(true);
        const productId = this.$$ProductID();
        const isUpdateMode = productId > 0;

        const submitAction = isUpdateMode
            ? this.productService.update(productId, this.product)
            : this.productService.create(this.product);
        submitAction.subscribe({
            next: () => {
                const action = isUpdateMode ? 'updated' : 'created';
                this.notification.set({
                    type: 'success',
                    message: `Product ${this.product.productName} has been ${action} successfully.`,
                });

                this.loading.set(false);
                this.fetchProducts();
                this.closeModal();
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);

                const action = isUpdateMode ? 'updated' : 'created';
                this.notification.set({
                    type: 'error',
                    message: `Failed to ${action} product.`,
                });
            }
        });
    }

    isFormValid(): boolean {
        return (
            this.product.productName.trim().length >= 3 &&
            this.product.description.trim().length >= 5
        );
    }

    isStockFormValid(): boolean {
        if (this.enableField) {
            return this.stock.basePrice != null && this.stock.basePrice >= 0;
        }
        return !(!this.stockCreateDTO.stockQty || this.stockCreateDTO.stockQty < 0);
    }

    onEditBasePriceToggle() {
        if (this.enableField) {
            this.$$globalPrice.set(1)
            this.$$customerId.set(-1)
            this.price.priceValue = 0;
            this.enableCustomField = false;
        } else {
            this.onVariantSelect(null);
        }
    }

    onEditCustomerBasePriceToggle() {
        if (this.enableField) {
            this.$$globalPrice.set(0)
            this.price.priceValue = 0;
            this.enableField = false;
        } else {
            this.onVariantSelect(null);
        }
    }

    onVariantSelect(variant: any) {
        if (variant) {
            this.$$VariantID.set(variant.variantId);
            this.selectedVariant = variant;
            this.stockCreateDTO.variantId = variant.variantId;
            this.stockCreateDTO.stockId = variant.stockId;
            this.variantPrice.currentPrice = variant.basePrice;
            this.variantPrice.currentCost = variant.cost;
            this.variantPrice.basePrice = 0.00;
            this.variantPrice.cost = 0.00;
            this.stockCreateDTO.stockQty = null!;
            this.stock.basePrice = null!;
        }
    }

    updateStock() {
        if (this.isStockFormValid()) {

        }
        this.loading.set(true);

        this.variantStock.create(this.stockCreateDTO).subscribe({
            next: () => {
                this.notification.set({
                    type: 'success',
                    message: 'Stock has been created successfully.',
                });
                this.loading.set(false);
                this.closeModal();
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
                this.notification.set({
                    type: 'error',
                    message: 'Failed to create stock.',
                });
            }
        });
    }


    updateBasePrice() {
        if (this.$$VariantID() <= 0) {
            this.notification.set({
                type: 'alert',
                message: `Please select a variant to update base price.`,
            });
            return;
        }
        ;

        this.loading.set(true);
        const payload = {
            updatedBy: String(this.authService.$$LoggedUserID()),
            basePrice: this.variantPrice.basePrice,
            cost: this.variantPrice.cost
        }
        this.variantService.updateBase(this.$$VariantID(), payload).subscribe({
            next: (res) => {
                this.notification.set({
                    type: 'success',
                    message: `Product Price has been update successfully.`,
                });
                this.loading.set(false);

            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
                this.notification.set({
                    type: 'error',
                    message: `Failed to update product price.`,
                });
            }
        })

    }

    updatePrice() {
        if (this.$$VariantID() <= 0) {
            this.notification.set({
                type: 'alert',
                message: `Please select a variant to update base price.`,
            });
            return;
        }
        ;
        this.loading.set(true);
        const payload = {
            shopPrices: [{
                priceValue: this.price.priceValue,
                isGlobal: this.$$globalPrice(),
                variantId: this.$$VariantID(),
                shopId: this.$$customerId() || null,
                createdBy: this.authService.$$LoggedUserID()
            }]
        };
        const submitAction = this.$$UpdateMode()
            ? this.priceService.update(this.$$VariantID(), payload)
            : this.priceService.create(payload);

        submitAction.subscribe({
            next: () => {
                const action = this.$$UpdateMode() ? 'updated' : 'created';

                this.notification.set({
                    type: 'success',
                    message: `Product Price has been ${action} successfully.`,
                });
                this.loading.set(false);
                this.closeModal();
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
                const action = this.$$UpdateMode() ? 'updated' : 'created';
                this.notification.set({
                    type: 'error',
                    message: `Failed to ${action} product.`,
                });
            }
        });
    }

    createVariant() {
        this.loading.set(true);
        const payload = {
            variants: [{
                ...this.variant,
                productId: this.$$ProductID(),
                productName: this.productDetailsDTOS[0].productName
            }]
        };
        const submitAction = this.$$UpdateMode()
            ? this.variantService.update(this.$$VariantID(), payload)
            : this.variantService.create(payload);

        submitAction.subscribe({
            next: () => {
                const action = this.$$UpdateMode() ? 'updated' : 'created';
                this.notification.set({
                    type: 'success',
                    message: `Variant has been ${action} successfully.`,
                });
                this.loading.set(false);
                this.closeModal();
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
                const action = this.$$UpdateMode() ? 'updated' : 'created';
                this.notification.set({
                    type: 'error',
                    message: `Failed to ${action} variant.`,
                });
            }
        });
    }

    closeModal() {
        this.$$StockUpdateModal.set(false);
        this.$$DetailsModal.set(false);
        this.$$CreateModal.set(false);
        this.$$ProductID.set(-1);
        this.productDetailsDTOS = [];
        this.product = {
            warehouseId: 1,
            productName: '',
            description: '',
            createdBy: '',
        };
        this.$$UpdateMode.set(false);
        this.$$customerId.set(-1)
        this.enableField = false;
        this.enableCustomField = false;
        this.selectedVariant = '';
        this.stockCreateDTO.stockQty = 0;
        this.price.priceValue = 0;
        this.stockCreateDTO.stockId = -1;
    }

    protected readonly faExclamationCircle = faExclamationCircle;
}
