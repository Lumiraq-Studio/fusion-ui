import {Component} from '@angular/core';
import {faArrowUp, faEllipsisV, faSearch, faWallet} from "@fortawesome/free-solid-svg-icons";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PaginationComponent} from "../../../../core";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {PaymentPopupComponent} from "../payment-popup/payment-popup.component";
import {FormsModule} from "@angular/forms";
import {PaymentRecord} from "../../interfaces/payment-record.entity";

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

    // Popup state
    isPopupOpen = false;
    popupMode: 'cash_in' | 'cash_out' = 'cash_in';
    editingRecord?: PaymentRecord;
    // @ts-ignore
    viewingTransaction: PaymentRecord;

    // Filter state
    searchTerm = '';
    filterType = 'all';
    filterPeriod = 'today';
    dropdownOpen: string | null = null;

    // Pagination
    searchParams = {
        page_number: 1,
        items_per_page: 10
    };
    pageNumber = 1;
    totalItems = 0;
    itemsPerPage = 10;

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

    // Sample categories for display
    categories = {
        sales: 'Sales Revenue',
        investment: 'Investment',
        other_income: 'Other Income',
        raw_materials: 'Raw Materials',
        operating_expenses: 'Operating Expenses',
        salaries_wages: 'Salaries & Wages',
        owner_withdrawal: 'Owner Withdrawal'
    };

    subcategories = {
        product_sales: 'Product Sales',
        service_income: 'Service Income',
        wholesale: 'Wholesale',
        owner_investment: 'Owner Investment',
        loan_received: 'Loan Received',
        grant: 'Grant/Subsidy',
        interest_earned: 'Interest Earned',
        rental_income: 'Rental Income',
        miscellaneous: 'Miscellaneous',
        wet_rice_flour: 'Wet Rice Flour',
        dry_ingredients: 'Dry Ingredients',
        packaging: 'Packaging Materials',
        utilities: 'Utilities',
        rent: 'Rent',
        maintenance: 'Maintenance',
        employee_salary: 'Employee Salary',
        overtime: 'Overtime Pay',
        bonus: 'Bonus',
        profit_withdrawal: 'Profit Withdrawal',
        personal_expenses: 'Personal Expenses'
    };

    constructor() {
        this.applyFilters();
    }

    // Balance calculations
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

    onTransactionSubmit(transaction: PaymentRecord) {
        if (this.editingRecord) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === this.editingRecord!.id);
            if (index !== -1) {
                this.transactions[index] = { ...transaction, id: this.editingRecord.id };
            }
        } else {
            // Add new transaction
            const newTransaction = {
                ...transaction,
                id: this.generateId()
            };
            this.transactions.unshift(newTransaction);
        }

        this.applyFilters();
        // Here you would typically call your API service
        console.log('Transaction submitted:', transaction);
    }

    onTransactionDraft(transaction: PaymentRecord) {
        // Handle draft saving logic
        console.log('Transaction saved as draft:', transaction);
        // You might want to save to localStorage or send to backend
    }

    // Transaction management
    editTransaction(transaction: PaymentRecord) {
        this.editingRecord = transaction;
        this.popupMode = transaction.type;
        this.isPopupOpen = true;
        this.dropdownOpen = null;
    }

    viewTransaction(transaction: PaymentRecord) {
        this.viewingTransaction = transaction;
        this.dropdownOpen = null;
    }

    closeTransactionDetails() {
      
    }

    deleteTransaction(transaction: PaymentRecord) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== transaction.id);
            this.applyFilters();
        }
        this.dropdownOpen = null;
    }

    toggleDropdown(transactionId: string) {
        this.dropdownOpen = this.dropdownOpen === transactionId ? null : transactionId;
    }

    // Filtering and search
    onSearch() {
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.transactions];

        // Search term filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(tx =>
                tx.description?.toLowerCase().includes(term) ||
                tx.reference?.toLowerCase().includes(term) ||
                this.getCategoryName(tx.categoryId).toLowerCase().includes(term) ||
                this.getSubcategoryName(tx.subcategoryId).toLowerCase().includes(term)
            );
        }

        // Type filter
        if (this.filterType !== 'all') {
            filtered = filtered.filter(tx => tx.type === this.filterType);
        }

        // Period filter
        if (this.filterPeriod !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (this.filterPeriod) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
            }

            filtered = filtered.filter(tx => new Date(tx.date) >= filterDate);
        }

        this.filteredTransactions = filtered;
        this.totalItems = filtered.length;
        this.updatePaginatedTransactions();
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

    // Utility methods
    generateId(): string {
        return 'tx_' + Math.random().toString(36).substr(2, 9);
    }

    generateTxnId(transaction: PaymentRecord): string {
        return `#${transaction.type.toUpperCase()}-${transaction.id?.substr(-3).toUpperCase()}`;
    }

    getCategoryName(categoryId: string): string {
        return this.categories[categoryId as keyof typeof this.categories] || categoryId;
    }

    getSubcategoryName(subcategoryId: string): string {
        return this.subcategories[subcategoryId as keyof typeof this.subcategories] || subcategoryId;
    }

    formatPaymentMethod(method: string): string {
        const methods = {
            cash: 'Cash',
            cheque: 'Cheque',
            bank_transfer: 'Bank Transfer',
            card: 'Card'
        };
        return methods[method as keyof typeof methods] || method;
    }

    calculateRunningBalance(transaction: PaymentRecord): number {
        const txIndex = this.filteredTransactions.findIndex(tx => tx.id === transaction.id);
        return this.filteredTransactions
            .slice(0, txIndex + 1)
            .reduce((balance, tx) =>
                tx.type === 'cash_in' ? balance + tx.amount : balance - tx.amount, 0);
    }

    // Analytics methods
    getAverageTransaction(): number {
        if (this.transactions.length === 0) return 0;
        const total = this.transactions.reduce((sum, tx) => sum + tx.amount, 0);
        return total / this.transactions.length;
    }

    getRecentActivities(): PaymentRecord[] {
        return this.transactions
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }

    getCashInPercentage(): number {
        const cashIn = this.transactions.filter(tx => tx.type === 'cash_in').length;
        return this.transactions.length ? Math.round((cashIn / this.transactions.length) * 100) : 0;
    }

    getCashOutPercentage(): number {
        const cashOut = this.transactions.filter(tx => tx.type === 'cash_out').length;
        return this.transactions.length ? Math.round((cashOut / this.transactions.length) * 100) : 0;
    }

    getWeeklyAverage(): number {
        // Calculate based on last 4 weeks
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const recentTransactions = this.transactions.filter(tx =>
            new Date(tx.date) >= fourWeeksAgo
        );

        const total = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        return total / 1000; // Return in thousands
    }

    getDailyTransactions(): number {
        const today = new Date().toDateString();
        return this.transactions.filter(tx =>
            new Date(tx.date).toDateString() === today
        ).length;
    }

    getTimeAgo(dateString: string): string {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
    }
}