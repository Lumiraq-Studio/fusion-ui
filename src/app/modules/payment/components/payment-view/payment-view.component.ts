import {Component, inject} from '@angular/core';
import {faArrowUp, faEllipsisV, faSearch, faWallet} from "@fortawesome/free-solid-svg-icons";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LoadingService, NotificationService, PaginationComponent} from "../../../../core";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {PaymentPopupComponent} from "../payment-popup/payment-popup.component";
import {FormsModule} from "@angular/forms";
import {PaymentRecord} from "../../interfaces/payment-record.entity";
import {SalesPersonService} from "../../../sales-persons/services/sales-person.service";
import {ExpensesService} from "../../services/expenses.service";
import {CashSummaryDTO, SalesRepExpenseDTO} from "../../interfaces/expenses.entity";

@Component({
    selector: 'app-payment-view',
    imports: [
        FaIconComponent,
        PaginationComponent,
        DecimalPipe,
        PaymentPopupComponent,
        DatePipe,
        FormsModule,
        NgIf,
        NgForOf
    ],
    templateUrl: './payment-view.component.html',
    standalone: true,
    styleUrl: './payment-view.component.scss'
})
export class PaymentViewComponent {
    protected readonly faSearch = faSearch;
    protected readonly faArrowDown = faArrowDown;
    protected readonly faArrowUp = faArrowUp;
    protected readonly faWallet = faWallet;
    protected readonly faEllipsisV = faEllipsisV;


    salesPersonService = inject(SalesPersonService);
    expensesService = inject(ExpensesService);
    loading = inject(LoadingService);
    notification = inject(NotificationService);

    isPopupOpen = false;
    popupMode: 'cash_in' | 'cash_out' = 'cash_in';
    editingRecord?: PaymentRecord;

    // Pagination
    searchParams = {
        salesRepId: -1,
        expensesDate: '',
        page_number: 1,
        items_per_page: 10
    };
    pageNumber = 1;
    totalItems = 0;
    itemsPerPage = 10;


    salesRepExpenseDTOS: SalesRepExpenseDTO[] = []
    cashSummaryDTOS: CashSummaryDTO[] = []
    // Data
    transactions: PaymentRecord[] = [
        {
            id: '2',
            type: 'cash_out',
            amount: 5000,
            categoryId: 'raw_materials',
            subcategoryId: 'wet_rice_flour',
            paymentMethod: 'cheque',
            description: 'Weekly flour purchase',
            date: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            reference: 'TRX-002',
            chequeDetails: {
                chequeNumber: '123456',
                bankName: 'Bank of Ceylon',
                chequeDate: new Date().toISOString().split('T')[0]
            }
        }
    ];

    filteredTransactions: PaymentRecord[] = [];
    paginatedTransactions: PaymentRecord[] = [];


    constructor() {
        this.applyFilters();
        this.getSummary()
    }

    get currentBalance(): number {
        return this.transactions.reduce((balance, tx) =>
            tx.type === 'cash_in' ? balance + tx.amount : balance - tx.amount, 0);
    }

    get todayCashIn(): number {
        const today = new Date().toDateString();
        return this.transactions
            .filter(tx => tx.type === 'cash_in' && new Date(tx.date).toDateString() === today)
            .reduce((sum, tx) => sum + tx.amount, 0);
    }

    get todayCashOut(): number {
        const today = new Date().toDateString();
        return this.transactions
            .filter(tx => tx.type === 'cash_out' && new Date(tx.date).toDateString() === today)
            .reduce((sum, tx) => sum + tx.amount, 0);
    }

    // Popup methods
    openCashIn() {
        this.popupMode = 'cash_in';
        this.editingRecord = undefined;
        this.isPopupOpen = true;
    }

    openCashOut() {
        this.popupMode = 'cash_out';
        this.editingRecord = undefined;
        this.isPopupOpen = true;
    }

    closePopup() {
        this.isPopupOpen = false;
        this.editingRecord = undefined;
    }


    applyFilters() {
        this.loading.set(true)
        this.expensesService.find(this.searchParams, true).subscribe({
            next: (response) => {
                if (response.data.data !== null){
                    this.salesRepExpenseDTOS = response.data.data
                    this.totalItems = response.data.totalItems;
                    this.pageNumber = response.data.page;
                    this.itemsPerPage = response.data.itemsPerPage;
                    this.loading.set(false);
                }
                else{
                    this.salesRepExpenseDTOS = [];
                    this.loading.set(false);
                }
            },
            error: (error) => {
                this.loading.set(false);
                console.error(error);
            }
        })
    }

    generateReference(dateString: string, index: number): string {
        const prefix = 'PA';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const refNumber = index.toString().padStart(3, '0');
        return `${prefix}-${year}${month}-${refNumber}`;
    }


    onPageChange(pageNumber: number) {
        this.pageNumber = pageNumber;
        this.searchParams.page_number = pageNumber;
        this.updatePaginatedTransactions();
    }

    updatePaginatedTransactions() {
        const startIndex = (this.pageNumber - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
    }

    getSummary(){
        this.expensesService.salesSummary(true).subscribe({
            next: (response) => {
              this.cashSummaryDTOS=[response.data]
                console.log(this.cashSummaryDTOS)
            },
            error: (error) => {
                console.error(error);
            }
        })
    }

}