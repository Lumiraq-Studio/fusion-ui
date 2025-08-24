import {Component, inject, numberAttribute} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
    faBoxes,
    faChartBar,
    faClock,
    faDownload,
    faFileAlt,
    faMoneyBill,
    faShare,
    faTruck,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {SalesPersonService} from "../../../sales-persons/services/sales-person.service";
import {RouteService} from "../../../routes/services/routes.service";
import {CustomerSearchComponent} from "../../../shared";
import {ReportsService} from "../../services/reports.service";
import {NgClass} from "@angular/common";
import {LoadingService} from "../../../../core";
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

enum ReportType {
    SALES = 'sales',
    CUSTOMER = 'customer',
    INVENTORY = 'inventory',
    FINANCIAL = 'financial'
}

@Component({
    selector: 'app-report-download',
    imports: [
        FaIconComponent,
        FormsModule,
        CustomerSearchComponent,
        NgClass
    ],
    templateUrl: './report-download.component.html',
    standalone: true,
    styleUrl: './report-download.component.scss'
})
export class ReportDownloadComponent {

    salesPersonService = inject(SalesPersonService);
    routeService = inject(RouteService)
    reportsService = inject(ReportsService)
    loading = inject(LoadingService);

    routeId = -1

    SalesOrderReport = {
        route: -1,
        salesRep: -1,
        customer: -1,
        status: '',
        startDate: '',
        endDate: ''
    }

    onCustomerSelected(shop: any): void {
        if (!shop) return;
        this.SalesOrderReport.customer = shop.id;
    }

    onSalesRepChange(event: any) {
        this.SalesOrderReport.salesRep = Number(event.target.value);
    }

    onRouteChange(event: any) {
        this.SalesOrderReport.route = Number(event.target.value);
        this.routeId = Number(event.target.value);
    }

    onOrderStatusChange(event: any) {
        this.SalesOrderReport.status = String(event.target.value);
    }

    isError(): boolean {
        if (this.activeReportType !== ReportType.CUSTOMER) {
            return !this.SalesOrderReport.startDate || !this.SalesOrderReport.endDate;
        }
        return false;
    }

    download() {
        this.loading.set(true);
        if (this.isError()) {
            return;
        }
        if (this.activeReportType == ReportType.CUSTOMER) {
            this.reportsService.priceReport(this.routeId, true).subscribe({
                next: (res) => {
                    this.exportToExcel('CustomerPrices', res.data)
                    this.loading.set(false);
                    this.clear()
                }, error: (error) => {
                    this.loading.set(false);
                    console.error('Failed to generate report:', error);
                }
            })
        } else {
            this.reportsService.salesReport(this.SalesOrderReport, true).subscribe({
                next: (res) => {
                    this.exportToExcel('SalesOrderReport', res.data)
                    this.loading.set(false);
                    this.clear()
                }, error: (error) => {
                    this.loading.set(false);
                    console.error('Failed to generate report:', error);
                }
            })
        }


    }

    exportToExcel(fileName: string, data: any[]): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
            Sheets: {data: worksheet},
            SheetNames: ['data']
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const date = new Date().toISOString().split('T')[0];
        const file = `${fileName}${date}.xlsx`;
        this.saveAsExcelFile(excelBuffer, file);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const blob = new Blob([buffer], {
            type: 'application/octet-stream'
        });

        saveAs(blob, `${fileName}.xlsx`);
    }

    activeReportType: ReportType = ReportType.SALES;

    clear() {
        this.SalesOrderReport = {
            route: -1,
            salesRep: -1,
            customer: -1,
            status: '',
            startDate: '',
            endDate: ''
        }

    }



    isActiveReportType(type: any): boolean {
        return this.activeReportType === type;
    }


    setReportType(type: any): void {
        this.activeReportType = type;
    }

    get reportTitle(): string {
        switch (this.activeReportType) {
            case ReportType.SALES:
                return 'Sales Reports';
            case ReportType.CUSTOMER:
                return 'Customer Price Reports';
            case ReportType.INVENTORY:
                return 'Inventory Reports';
            case ReportType.FINANCIAL:
                return 'Financial Reports';
        }
    }


    protected readonly faChartBar = faChartBar;
    protected readonly faBoxes = faBoxes;
    protected readonly faUsers = faUsers;
    protected readonly faMoneyBill = faMoneyBill;
    protected readonly faTruck = faTruck;
    protected readonly faDownload = faDownload;
    protected readonly faFileAlt = faFileAlt;
    protected readonly faClock = faClock;
    protected readonly faShare = faShare;
}
