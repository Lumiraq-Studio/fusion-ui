export interface PaymentCategory {
    id: string;
    name: string;
    subcategories: PaymentSubcategory[];
}

export interface PaymentSubcategory {
    id: string;
    name: string;
    categoryId: string;
}

export interface PaymentRecord {
    id: string;
    type: 'cash_in' | 'cash_out';
    amount: number;
    categoryId: string;
    subcategoryId: string;
    paymentMethod: 'cash' | 'cheque' | 'bank_transfer' | 'card';
    description: string;
    reference?: string;
    chequeDetails: {
        chequeNumber: string;
        bankName: string;
        chequeDate: string;
    };
    date: string;
}
