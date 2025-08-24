export interface FindOrderDTO {
    orderId: number;
    orderAmount: number;
    orderDate: string;
    orderTime: string;
    orderType: string;
    status: string;
    paymentType: string;
    customerName: string;
    salesRepName: string;
    orderReference: string;

}

export interface OrderData {
    orderId: number;
    orderDate: string;
    orderType: string;
    orderStatus: string;
    paymentType: string;
    customerName: string;
    salesRepName: string;
    orderReference: string;
}


export interface ProductDetailsDTO {
    productId: number;
    productName: string;
    description: string;
    basePrice: number;
    unit: string;
    cost: number;
}


export interface VariantDetailsDTO {
    variantId: number;
    weight: number;
    price: number;
}


export interface OrderItemDTO {
    orderItemId: number;
    productId: number;
    quantity: number;
    price: number;
    totalPrice: number;
    status: string;
    variantId: number;
    productDetails: ProductDetailsDTO;
    variantDetails: VariantDetailsDTO;
}

// DTO for Shop Details
export interface ShopDetailsDTO {
    shopId: number;
    shopCode: string;
    fullName: string;
    shortName: string;
    address: string;
    mobile: string;
    routeId: number;
    status: string;
}

// DTO for Order
export interface GetOrderDTO {
    orderId: number;
    orderType: string;
    status: string;
    salesRepId: number;
    paidAmount: number;
    orderReference: string;
    orderDate: string;
    orderTime: string;
    paymentType: number;
    shopId: number;
    shopCode: string;
    shopName: string;
    orderItems: OrderItemDTO[];
    orderAmount: number;
}

export interface OrderItemDTO {
    unit: string;
    price: number;
    status: string;
    weight: number;
    quantity: number;
    productId: number;
    variantId: number;
    totalPrice: number;
    orderItemId: number;
    productName: string;
}

export interface ViewData {
    orderId: number;
    status: string;
    shopId: number;
    salesRepId: number;
    orderReference: string;
    orderDate: string;
    paymentType: string;
    shopDetails: ShopDetails;
    orderItems: OrderItem[];
}

export interface ShopDetails {
    shopId: number;
    shopCode: string;
    fullName: string;
    shortName: string;
    address: string;
    mobile: string;
    routeId: number;
    status: string;
}

export interface OrderItem {
    orderItemId: number;
    productId: number;
    quantity: number;
    price: number;
    totalPrice: number;
    status: string; //
    variantId: number;
    productDetails: ProductDetails;
    variantDetails: VariantDetails;
}

export interface ProductDetails {
    productId: number;
    productName: string;
    description: string;
    unit: string;
    basePrice: number;
    cost: number;
}

export interface VariantDetails {
    variantId: number;
    weight: number;
    price: number;
}

export interface OrderItemsData {
    orderItemId: number;
    productId: number;
    quantity: number;
    price: number;
    totalPrice: number;
    status: string; //
    variantId: number;
    productDetails: ProductDetails;
    variantDetails: VariantDetails;
}

export interface ProductDetails {
    productId: number;
    productName: string;
    description: string;
    unit: string;
    basePrice: number;
    cost: number;
}

export interface VariantDetails {
    variantId: number;
    weight: number;
    price: number;
}

export interface CreateOrderItem {
    quantity: number;
    variantId: number;
    price: number;
    paidAmount: number;
}

export interface CreateOrderDTO {
    orderDate: string;
    orderStatus: string;
    shopId: number;
    paid: number;
    salesRep: number;
    paymentType: number;
    createdBy: number;
    orderType: string;
    orderItems: CreateOrderItem[];
}

//updated
export interface CartItem {
    variantId: number;
    productName: string;
    weight: number;
    unit: string;
    quantity: number;
    price: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}
