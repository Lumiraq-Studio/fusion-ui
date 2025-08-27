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
    @Input() editingRecord?: any; // Adjust type as needed, e.g., PaymentRecord
    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<any>(); // Adjust type as needed
    @Output() draft = new EventEmitter<any>(); // Adjust type as needed

    // Icons
    protected readonly faArrowDown = faArrowDown;
    protected readonly faArrowUp = faArrowUp;
    protected readonly faTimes = faTimes;
    protected readonly faCheck = faCheck;

    paymentForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.paymentForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]],
            description: [''],
            salesRepId: ['', [Validators.required]],
            createdBy: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        if (this.editingRecord) {
            this.loadEditingRecord();
        }
    }

    setMode(mode: 'cash_in' | 'cash_out') {
        this.mode = mode;
    }

    closePopup() {
        this.paymentForm.reset();
        this.close.emit();
    }

    onSubmit() {
        if (this.paymentForm.invalid) {
            this.paymentForm.markAllAsTouched();
            return;
        }

        const payload = {
            description: this.paymentForm.value.description,
            amount: this.paymentForm.value.amount,
            salesRepId: +this.paymentForm.value.salesRepId,
            createdBy: this.paymentForm.value.createdBy,
            type: this.mode === 'cash_in' ? 'Income' : 'Expense'
        };

        this.submit.emit(payload);
        this.closePopup();
    }

    saveDraft() {
        const payload = {
            description: this.paymentForm.value.description,
            amount: this.paymentForm.value.amount,
            salesRepId: +this.paymentForm.value.salesRepId,
            createdBy: this.paymentForm.value.createdBy,
            type: this.mode === 'cash_in' ? 'Income' : 'Expense'
        };

        this.draft.emit(payload);
        this.closePopup();
    }

    private loadEditingRecord() {
        if (this.editingRecord) {
            this.mode = this.editingRecord.type === 'Income' ? 'cash_in' : 'cash_out';
            this.paymentForm.patchValue({
                amount: this.editingRecord.amount,
                description: this.editingRecord.description,
                salesRepId: this.editingRecord.salesRepId,
                createdBy: this.editingRecord.createdBy
            });
        }
    }
}