import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {faArrowDown, faArrowUp, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {SalesPersonService} from "../../../sales-persons/services/sales-person.service";
import {AuthenticationService} from "../../../../core/modules/authentication/service/authentication.service";
import {ExpensesService} from "../../services/expenses.service";
import {LoadingService, NotificationService} from "../../../../core";


@Component({
    selector: 'app-payment-popup',
    imports: [
        FaIconComponent,
        ReactiveFormsModule,
        NgIf,
        FormsModule
    ],
    templateUrl: './payment-popup.component.html',
    styleUrl: './payment-popup.component.scss'
})
export class PaymentPopupComponent implements OnChanges {


    ngOnChanges(changes: SimpleChanges) {
        if (changes['mode'] && !changes['mode'].firstChange) {
            this.setMode(this.mode);
        }
    }

    @Input() isOpen = false;
    @Input() mode: 'cash_in' | 'cash_out' = 'cash_in';
    @Input() editingRecord?: any; // Adjust type as needed, e.g., PaymentRecord
    @Output() close = new EventEmitter<void>();
    @Output() submit = new EventEmitter<any>(); // Adjust type as needed
    @Output() draft = new EventEmitter<any>(); // Adjust type as needed

    salesPersonService = inject(SalesPersonService);
    authenticationService = inject(AuthenticationService);
    expensesService = inject(ExpensesService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);

    userName: string = '';

    constructor() {
        const user = this.authenticationService.getUserInfo()
        if (user) {
            this.userName = user.userName
        }
    }

    amount: number | null = null;
    description: string = '';
    salesPerson: string = '';
    cashOutType: string = '';

    setMode(mode: any) {
        this.mode = mode;
        if (mode === 'cash_in') {
            // this.cashOutType = '';
            this.resetForm()
        }
    }

    onSubmit() {
        this.loading.set(true)
        const formData = {
            createdBy: this.userName,
            amount: this.amount,
            description: this.description,
            salesPerson: this.mode === 'cash_in' ? 1 : Number(this.salesPerson),
            type: this.mode === 'cash_out' ? this.cashOutType : (this.mode === 'cash_in' ? 'Income' : null)
        };
        this.expensesService.create(formData).subscribe({
            next: (response) => {
                this.notification.set({message: 'New record successfully saved', type: 'success'})
                this.loading.set(false);
                this.resetForm();
                this.submit.emit(response.data);
            },
            error: (error) => {
                this.notification.set({message: 'Failed to create record', type: 'error'})
                this.loading.set(false);
                console.error(error);
            }
        })
    }


    closePopup() {
        this.isOpen = false;
        this.resetForm()
        this.close.emit();
    }

    resetForm() {
        this.amount = null;
        this.description = '';
        this.salesPerson = '';
    }

    protected readonly faArrowUp = faArrowUp;
    protected readonly faArrowDown = faArrowDown;
    protected readonly faTimes = faTimes;
    protected readonly faCheck = faCheck;
}