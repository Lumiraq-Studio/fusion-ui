import {Component, effect, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {
    faBox,
    faExclamationCircle,
    faList,
    faPlus,
    faRotateLeft,
    faShoppingCart,
    faTrash,
    faUser,
    faWallet,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import {TitleCasePipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../services/order.service";
import {ProductService} from "../../../inventory/services/product.service";
import {CustomerService} from "../../../customers/services/customers.service";
import {ProductDetailsDto} from "../../../inventory/interfaces/product.entity";
import {ProductPriceDTO} from "../../../inventory/interfaces/product-price.entity";
import {LoadingService, NotificationService} from "../../../../core";
import {Cart, CartItem} from "../../interfaces/order.entity";
import {PaymentMethodsService} from "../../services/payment-methods.service";
import {catchError, EMPTY} from "rxjs";
import {CustomerSearchComponent} from "../../../shared";
import {AuthenticationService} from "../../../../core/modules/authentication/service/authentication.service";

@Component({
    selector: 'app-order-create-modal',
    standalone: true,
    imports: [
        FaIconComponent,
        FormsModule,
        TitleCasePipe,
        CustomerSearchComponent
    ],
    templateUrl: './order-create-modal.component.html'
})
export class OrderCreateModal {
    @Input() isOpen = false;
    @Output() closePopup = new EventEmitter<void>();

    faXmark = faXmark;
    faTrash = faTrash;
    protected readonly faRotateLeft = faRotateLeft;
    protected readonly faExclamationCircle = faExclamationCircle;
    protected readonly faWallet = faWallet;
    protected readonly faPlus = faPlus;
    protected readonly faUser = faUser;
    protected readonly faList = faList;
    protected readonly faBox = faBox;

    orderService = inject(OrderService);
    productService = inject(ProductService);
    paymentMethods = inject(PaymentMethodsService);
    authService = inject(AuthenticationService);
    customerService = inject(CustomerService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);

    productDetailsDTOS: ProductDetailsDto[] = [];
    productPriceDTOS: ProductPriceDTO[] = [];
    paidAmountError: string = '';
    quantityInput: number = 0;
    selectedProduct: ProductPriceDTO | null = null;
    selectedVariant: ProductPriceDTO | null = null;
    uniqueProducts: ProductPriceDTO[] = [];
    validationErrors: ValidationErrors = {};

    $$paymentMethod = signal<number>(0);
    $$billingAmount = signal<number>(0);
    $$cart = signal<Cart>({items: [], total: 0});
    $$userID = signal<number>(this.authService.$$LoggedUserID());
    $$selectedCustomerID = signal<number>(0);
    $$selectedCustomer = signal('');

    constructor() {
        effect(() => {
            const productDetails = this.productService.active();
            if (productDetails) {
                this.productDetailsDTOS = [productDetails];
            }
        });
    }

    removeFromCart(variantId: number) {
        const items = this.$$cart().items.filter(item => item.variantId !== variantId);
        this.updateCart(items);
    }

    onCustomerSelected(shop: any): void {
        if (!shop) return;

        this.$$selectedCustomer.set(shop);
        this.$$selectedCustomerID.set(shop.id);

        const searchParams = {
            customer: this.$$selectedCustomerID(),
            rep: this.$$userID()
        };

        this.productService.getPrice(searchParams, true).pipe(
            catchError((error) => {
                console.error('Error fetching prices:', error);
                return EMPTY;
            })
        ).subscribe({
            next: (response) => {
                this.productPriceDTOS = response.data.data;
                this.uniqueProducts = Array.from(
                    new Map(
                        this.productPriceDTOS.map(item => [item.productId, item])
                    ).values()
                );
            }
        });
    }

    onProductChange(product: ProductPriceDTO) {
        this.selectedProduct = product;
        this.selectedVariant = null;
    }

    getFilteredVariants(): ProductPriceDTO[] {
        if (!this.selectedProduct) return [];
        return this.productPriceDTOS.filter(
            variant => variant.productId === this.selectedProduct?.productId
        );
    }

    onPaymentMethodChange(methodId: number) {
        this.$$paymentMethod.set(Number(methodId));
        if (Number(methodId) === 1) {
            this.$$billingAmount.set(this.$$cart().total);
        } else {
            this.$$billingAmount.set(0);
        }
    }

    onBillingAmountChange(event: Event): void {
        if (this.$$paymentMethod() !== 1) {
            const input = event.target as HTMLInputElement;
            const inputAmount = parseFloat(input.value || '0');
            const maxAmount = this.$$cart().total;

            if (inputAmount > maxAmount) {
                this.$$billingAmount.set(maxAmount);
            } else if (inputAmount < 1) {
                this.$$billingAmount.set(1);
            } else {
                this.$$billingAmount.set(inputAmount);
            }
        }
    }

    updateQuantity(value: string | number) {
        const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
        const maxQuantity = this.selectedVariant?.qty ?? 0;
        this.quantityInput = numValue > 0 ? Math.min(numValue, maxQuantity) : 0;
    }

    close() {
        this.closePopup.emit();
        this.resetOrder();
    }

    addToCart() {
        if (!this.selectedVariant || !this.selectedProduct || this.quantityInput <= 0) {
            return;
        }

        const cartItems = this.$$cart().items;
        const existingItem = cartItems.find(item => item.variantId === this.selectedVariant?.variantId);

        if (existingItem) {
            const updatedItems = cartItems.map(item =>
                item.variantId === this.selectedVariant?.variantId
                    ? {...item, quantity: item.quantity + this.quantityInput}
                    : item
            );
            this.updateCart(updatedItems);
        } else {
            const newItem: CartItem = {
                variantId: this.selectedVariant.variantId,
                productName: this.selectedProduct.productName,
                weight: this.selectedVariant.weight,
                unit: this.selectedVariant.unit,
                quantity: this.quantityInput,
                price: this.selectedVariant.price
            };
            this.updateCart([...cartItems, newItem]);
        }

        // Reset selection after adding to cart
        this.selectedProduct = null;
        this.selectedVariant = null;
        this.quantityInput = 0;
    }

    updateCart(items: CartItem[]) {
        const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        this.$$cart.set({
            items,
            total
        });
    }

    createOrder() {
        if (this.$$cart().items.length === 0) {
            this.notification.set({
                type: 'error',
                message: 'Cart is empty',
            });
            return;
        }

        const orderItems = this.$$cart().items.map(item => ({
            quantity: item.quantity,
            price: item.price,
            variantId: item.variantId
        }));

        const paid = this.$$paymentMethod() === 1
            ? this.$$cart().total
            : this.$$billingAmount();

        const orderPayload = {
            orderType: "Web-Order",
            orderDate: new Date().toISOString().split('T')[0],
            shopId: this.$$selectedCustomerID(),
            paid: paid,
            salesRep: this.$$userID(),
            createdBy: this.$$userID(),
            paymentType: this.$$paymentMethod(),
            orderItems: orderItems
        };

        this.loading.set(true);
        this.orderService.create(orderPayload).subscribe({
            next: (response) => {
                this.notification.set({
                    type: 'success',
                    message: 'Order created successfully',
                });
                this.loading.set(false);
                this.resetOrder();
                this.close();
            },
            error: (error) => {
                this.notification.set({
                    type: 'error',
                    message: 'Failed to create order',
                });
                this.loading.set(false);
            }
        });
    }

    resetOrder() {
        this.$$cart.set({items: [], total: 0});
        this.$$paymentMethod.set(0);
        this.$$billingAmount.set(0);
        this.selectedProduct = null;
        this.selectedVariant = null;
        this.quantityInput = 0;
        this.validationErrors = {};
    }

    protected readonly faShoppingCart = faShoppingCart;
}

interface ValidationErrors {
    orderType?: string;
    customer?: string;
}