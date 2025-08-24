import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { faArrowDown, faArrowUp, faTimes, faPlus, faCheck, faWallet, faCreditCard, faMoneyBill, faReceipt } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PaymentCategory, PaymentRecord} from "../../interfaces/payment-record.entity";
import {NgIf} from "@angular/common";


@Component({
    selector: 'app-payment-popup',
    imports: [
        FaIconComponent,
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './payment-popup.component.html',
    styleUrl: './payment-popup.component.scss'
})
export class PaymentPopupComponent implements OnInit {
    @Input() isOpen = false;
    @Input() mode: 'cash_in' | 'cash_out' = 'cash_in';
    @Input() editingRecord?: PaymentRecord;
    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<PaymentRecord>();
    @Output() draft = new EventEmitter<PaymentRecord>();

    // Icons
    protected readonly faArrowDown = faArrowDown;
    protected readonly faArrowUp = faArrowUp;
    protected readonly faTimes = faTimes;
    protected readonly faPlus = faPlus;
    protected readonly faCheck = faCheck;
    protected readonly faWallet = faWallet;
    protected readonly faCreditCard = faCreditCard;
    protected readonly faMoneyBill = faMoneyBill;
    protected readonly faReceipt = faReceipt;

    paymentForm: FormGroup;
    selectedCategory?: PaymentCategory;

    // Sample categories - replace with your actual data
    cashInCategories: PaymentCategory[] = [
        {
            id: 'sales',
            name: 'Sales Revenue',
            subcategories: [
                { id: 'product_sales', name: 'Product Sales', categoryId: 'sales' },
                { id: 'service_income', name: 'Service Income', categoryId: 'sales' },
                { id: 'wholesale', name: 'Wholesale', categoryId: 'sales' }
            ]
        },
        {
            id: 'investment',
            name: 'Investment',
            subcategories: [
                { id: 'owner_investment', name: 'Owner Investment', categoryId: 'investment' },
                { id: 'loan_received', name: 'Loan Received', categoryId: 'investment' },
                { id: 'grant', name: 'Grant/Subsidy', categoryId: 'investment' }
            ]
        },
        {
            id: 'other_income',
            name: 'Other Income',
            subcategories: [
                { id: 'interest_earned', name: 'Interest Earned', categoryId: 'other_income' },
                { id: 'rental_income', name: 'Rental Income', categoryId: 'other_income' },
                { id: 'miscellaneous', name: 'Miscellaneous', categoryId: 'other_income' }
            ]
        }
    ];

    cashOutCategories: PaymentCategory[] = [
        {
            id: 'raw_materials',
            name: 'Raw Materials',
            subcategories: [
                { id: 'wet_rice_flour', name: 'Wet Rice Flour', categoryId: 'raw_materials' },
                { id: 'dry_ingredients', name: 'Dry Ingredients', categoryId: 'raw_materials' },
                { id: 'packaging', name: 'Packaging Materials', categoryId: 'raw_materials' }
            ]
        },
        {
            id: 'operating_expenses',
            name: 'Operating Expenses',
            subcategories: [
                { id: 'utilities', name: 'Utilities', categoryId: 'operating_expenses' },
                { id: 'rent', name: 'Rent', categoryId: 'operating_expenses' },
                { id: 'maintenance', name: 'Maintenance', categoryId: 'operating_expenses' }
            ]
        },
        {
            id: 'salaries_wages',
            name: 'Salaries & Wages',
            subcategories: [
                { id: 'employee_salary', name: 'Employee Salary', categoryId: 'salaries_wages' },
                { id: 'overtime', name: 'Overtime Pay', categoryId: 'salaries_wages' },
                { id: 'bonus', name: 'Bonus', categoryId: 'salaries_wages' }
            ]
        },
        {
            id: 'owner_withdrawal',
            name: 'Owner Withdrawal',
            subcategories: [
                { id: 'profit_withdrawal', name: 'Profit Withdrawal', categoryId: 'owner_withdrawal' },
                { id: 'personal_expenses', name: 'Personal Expenses', categoryId: 'owner_withdrawal' }
            ]
        }
    ];

    constructor(private fb: FormBuilder) {
        this.paymentForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]],
            categoryId: ['', Validators.required],
            subcategoryId: ['', Validators.required],
            paymentMethod: ['cash', Validators.required],
            description: [''],
            reference: [''],
            chequeNumber: [''],
            bankName: [''],
            chequeDate: [''],
            date: [new Date().toISOString().slice(0, 16), Validators.required]
        });
    }

    ngOnInit() {
        if (this.editingRecord) {
            this.loadEditingRecord();
        }
    }

    setMode(mode: 'cash_in' | 'cash_out') {
        this.mode = mode;
        // Reset category selections when switching modes
        this.paymentForm.patchValue({
            categoryId: '',
            subcategoryId: ''
        });
        this.selectedCategory = undefined;
    }

    getFilteredCategories(): PaymentCategory[] {
        return this.mode === 'cash_in' ? this.cashInCategories : this.cashOutCategories;
    }

    onCategoryChange() {
        const categoryId = this.paymentForm.get('categoryId')?.value;
        this.selectedCategory = this.getFilteredCategories().find(cat => cat.id === categoryId);
        // Reset subcategory when category changes
        this.paymentForm.patchValue({ subcategoryId: '' });
    }

    closePopup() {
        this.paymentForm.reset({
            paymentMethod: 'cash',
            date: new Date().toISOString().slice(0, 16)
        });
        this.selectedCategory = undefined;
        this.close.emit();
    }

    onSubmit() {
 
    }

    saveDraft() {
      
        this.closePopup();
    }

    private loadEditingRecord() {
        if (this.editingRecord) {
            this.mode = this.editingRecord.type;
            this.paymentForm.patchValue({
                amount: this.editingRecord.amount,
                categoryId: this.editingRecord.categoryId,
                subcategoryId: this.editingRecord.subcategoryId,
                paymentMethod: this.editingRecord.paymentMethod,
                description: this.editingRecord.description,
                reference: this.editingRecord.reference,
                date: this.editingRecord.date,
                ...(this.editingRecord.chequeDetails && {
                    chequeNumber: this.editingRecord.chequeDetails.chequeNumber,
                    bankName: this.editingRecord.chequeDetails.bankName,
                    chequeDate: this.editingRecord.chequeDetails.chequeDate
                })
            });

            // Set selected category
            this.onCategoryChange();
        }
    }
}