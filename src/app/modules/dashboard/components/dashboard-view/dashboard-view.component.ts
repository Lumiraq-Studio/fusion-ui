import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    faPlus,
    faSearch,
    faDollarSign,
    faShoppingCart,
    faUsers,
    faClock,
    faChevronDown,
    faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import {DailySalesSummeryComponent} from "../daily-sales-summery/daily-sales-summery.component";

// Define interfaces for type safety
interface Route {
    id: number;
    name: string;
    revenue: number;
    orders: number;
    customers: number;
    achievementPercentage: number;
}

interface SalesRep {
    id: number;
    name: string;
    orders: number;
    revenue: number;
    target: number;
    achievementPercentage: number;
    expanded?: boolean;
    routes: Route[];
}

@Component({
    selector: 'app-dashboard-view',
    standalone: true,
    imports: [FaIconComponent, FormsModule, CommonModule, DailySalesSummeryComponent],
    templateUrl: './dashboard-view.component.html',
    styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent implements AfterViewInit, OnDestroy {
    // Font Awesome icons
    faPlus = faPlus;
    faSearch = faSearch;
    faDollarSign = faDollarSign;
    faShoppingCart = faShoppingCart;
    faUsers = faUsers;
    faClock = faClock;
    faChevronDown = faChevronDown;
    faChevronUp = faChevronUp;

    // Dashboard metrics
    totalRevenue = 2485750.5;
    totalOrders = 1247;
    activeCustomers = 892;
    pendingOrders = 23;

    // Sales reps data
    salesReps: SalesRep[] = [
        {
            id: 1,
            name: 'Ajith Kumara',
            orders: 127,
            revenue: 385000.0,
            target: 400000.0,
            achievementPercentage: 96.25,
            expanded: false,
            routes: [
                { id: 1, name: 'Colombo Central', revenue: 145000, orders: 45, customers: 28, achievementPercentage: 95 },
                { id: 2, name: 'Colombo North', revenue: 128000, orders: 38, customers: 22, achievementPercentage: 88 },
                { id: 3, name: 'Colombo West', revenue: 112000, orders: 44, customers: 31, achievementPercentage: 102 },
            ],
        },
        {
            id: 2,
            name: 'Priya Dissanayake',
            orders: 98,
            revenue: 295000.0,
            target: 350000.0,
            achievementPercentage: 84.29,
            expanded: false,
            routes: [
                { id: 4, name: 'Kandy Central', revenue: 98000, orders: 32, customers: 19, achievementPercentage: 78 },
                { id: 5, name: 'Kandy East', revenue: 87000, orders: 28, customers: 16, achievementPercentage: 82 },
                { id: 6, name: 'Peradeniya', revenue: 110000, orders: 38, customers: 25, achievementPercentage: 92 },
            ],
        },
        {
            id: 3,
            name: 'Chaminda Rathnayake',
            orders: 134,
            revenue: 425000.0,
            target: 400000.0,
            achievementPercentage: 106.25,
            expanded: false,
            routes: [
                { id: 7, name: 'Galle Fort', revenue: 155000, orders: 48, customers: 32, achievementPercentage: 112 },
                { id: 8, name: 'Matara', revenue: 142000, orders: 45, customers: 28, achievementPercentage: 105 },
                { id: 9, name: 'Hikkaduwa', revenue: 128000, orders: 41, customers: 26, achievementPercentage: 98 },
            ],
        },
        {
            id: 4,
            name: 'Sanduni Wickrama',
            orders: 89,
            revenue: 267000.0,
            target: 300000.0,
            achievementPercentage: 89.0,
            expanded: false,
            routes: [
                { id: 10, name: 'Negombo', revenue: 98000, orders: 31, customers: 18, achievementPercentage: 85 },
                { id: 11, name: 'Chilaw', revenue: 89000, orders: 28, customers: 15, achievementPercentage: 88 },
                { id: 12, name: 'Puttalam', revenue: 80000, orders: 30, customers: 17, achievementPercentage: 92 },
            ],
        },
        {
            id: 5,
            name: 'Tharaka Silva',
            orders: 112,
            revenue: 336000.0,
            target: 350000.0,
            achievementPercentage: 96.0,
            expanded: false,
            routes: [
                {
                    id: 13,
                    name: 'Kurunegala Central',
                    revenue: 125000,
                    orders: 38,
                    customers: 24,
                    achievementPercentage: 98,
                },
                { id: 14, name: 'Kuliyapitiya', revenue: 108000, orders: 35, customers: 21, achievementPercentage: 95 },
                { id: 15, name: 'Mawathagama', revenue: 103000, orders: 39, customers: 23, achievementPercentage: 94 },
            ],
        },
    ];

    // Charts
    private salesChart: ApexCharts | null = null;
    private categoryChart: ApexCharts | null = null;
    private monthlyChart: ApexCharts | null = null;

    ngAfterViewInit(): void {
        this.initializeCharts();
    }

    ngOnDestroy(): void {
        this.salesChart?.destroy();
        this.categoryChart?.destroy();
        this.monthlyChart?.destroy();
    }

    toggleSalesRepExpansion(repId: number): void {
        const rep = this.salesReps.find((r) => r.id === repId);
        if (rep) {
            rep.expanded = !rep.expanded;
        }
    }

    private initializeCharts(): void {
        this.initSalesChart();
        this.initMonthlyChart();
    }

    private initSalesChart(): void {
        const salesOptions = {
            series: [
                {
                    name: 'Daily Sales',
                    data: [31000, 42000, 35000, 51000, 49000, 62000, 69000, 58000, 45000, 67000, 74000, 83000],
                },
                {
                    name: 'Daily Expenses',
                    data: [25000, 30000, 28000, 40000, 38000, 45000, 50000, 42000, 35000, 48000, 52000, 60000],
                },
            ],
            chart: {
                height: 320,
                type: 'area',
                toolbar: { show: false },
            },
            colors: ['#10B981', '#ff6c6c'], // Green for Sales, Red for Expenses
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.1,
                    stops: [0, 90, 100],
                },
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: { style: { colors: '#64748B' } },
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => `රු ${(value / 1000).toFixed(0)}K`,
                    style: { colors: '#64748B' },
                },
            },
            grid: { borderColor: '#E2E8F0' },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                labels: { colors: '#64748B' },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (value: number) => `රු ${(value / 1000).toFixed(0)}K`,
                },
            },
        };

        const salesElement = document.querySelector('#salesChart');
        if (salesElement) {
            this.salesChart = new ApexCharts(salesElement, salesOptions);
            this.salesChart.render();
        } else {
            console.warn('Sales chart element (#salesChart) not found in the DOM.');
        }
    }
    private initMonthlyChart(): void {
        const monthlyOptions = {
            series: [
                {
                    name: 'Revenue',
                    type: 'column',
                    data: [440000, 505000, 414000, 671000, 227000, 413000, 201000, 352000, 752000, 320000, 257000, 160000],
                },
                {
                    name: 'Orders',
                    type: 'line',
                    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
                },
            ],
            chart: {
                height: 380,
                type: 'line',
                background: 'white',
                foreColor: '#E5E7EB',
                toolbar: { show: false },
            },
            theme: { mode: 'dark' },
            colors: ['grey', 'black'],
            stroke: { width: [0, 4], curve: 'smooth' },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
            markers: {
                size: [0, 6],
                colors: ['#3B82F6', '#10B981'],
                strokeColors: '#1F2937',
                strokeWidth: 2,
                hover: { size: 8 },
            },
            dataLabels: { enabled: true, enabledOnSeries: [1] },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                labels: { style: { colors: '#9CA3AF', fontSize: '12px' } },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: [
                {
                    title: { text: 'Revenue (රු)', style: { color: '#9CA3AF', fontSize: '12px', fontWeight: '500' } },
                    labels: {
                        formatter: (value: number) => `රු ${(value / 1000).toFixed(0)}K`,
                        style: { colors: '#9CA3AF', fontSize: '11px' },
                    },
                },
                {
                    opposite: true,
                    title: { text: 'Orders', style: { color: '#9CA3AF', fontSize: '12px', fontWeight: '500' } },
                    labels: { style: { colors: '#9CA3AF', fontSize: '11px' } },
                },
            ],
            grid: { borderColor: '#374151', strokeDashArray: 3, xaxis: { lines: { show: false } } },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                labels: { colors: '#E5E7EB' },
            },
            tooltip: { theme: 'dark', shared: true, intersect: false },
        };

        const monthlyElement = document.querySelector('#monthlyChart');
        if (monthlyElement) {
            this.monthlyChart = new ApexCharts(monthlyElement, monthlyOptions);
            this.monthlyChart.render();
        } else {
            console.warn('Monthly chart element (#monthlyChart) not found in the DOM.');
        }
    }
}