import {AfterViewInit, Component, EventEmitter, HostListener, inject, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
    faBell,
    faBoxes, faCog, faCreditCard,
    faHome,
    faLineChart,
    faMapLocationDot,
    faMobileAndroid,
    faPeopleRoof, faQuestionCircle,
    faSearch,
    faShoppingCart,
    faSignOut,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import {faPeopleGroup} from "@fortawesome/free-solid-svg-icons/faPeopleGroup";
import {AuthenticationService} from "../../modules/authentication/service/authentication.service";

interface NavItem {
    label: string;
    icon: any;
    route: string;
    disabled?: boolean;
    badge?: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [
        FaIconComponent,
        RouterLink,
        RouterLinkActive,
        NgClass
    ],
    templateUrl: './sidebar.component.html',
    standalone: true,
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit {

    protected readonly faSearch = faSearch;
    protected readonly faSignOut = faSignOut;
    @Output() collapsedChange = new EventEmitter<boolean>();

    private authService = inject(AuthenticationService);

    collapsed = true;

    constructor() {
        this.collapsed = window.innerWidth < 1024;
    }

    ngAfterViewInit(): void {
        this.collapsedChange.emit(this.collapsed);
    }


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        const newCollapsedState = window.innerWidth < 1024;
        if (this.collapsed !== newCollapsedState) {
            this.collapsed = newCollapsedState;
            this.collapsedChange.emit(this.collapsed);
        }
    }

    navItems: NavItem[] = [
        {label: 'Dashboard', icon: faHome, route: '/dashboard'},
        {label: 'Sales Orders', icon: faShoppingCart, route: '/orders'},
        {label: 'Inventory', icon: faBoxes, route: '/inventory'},
        {label: 'Reports', icon: faLineChart, route: '/reports'},
        {label: 'Customers', icon: faUsers, route: '/customers'},
        {label: 'Routing', icon: faMapLocationDot, route: '/routes'},
        {label: 'Sales Team', icon: faPeopleGroup, route: '/sales-persons'},
        {label: 'Employees', icon: faPeopleRoof, route: '/test', disabled: true },
        {label: 'App Center', icon: faMobileAndroid, route: '/navoda-app', badge: '1',disabled: true},
        {label: 'Payments', icon: faCreditCard, route: '/payments',disabled: true},
        {label: 'Notifications', icon: faBell, route: '/notifications', disabled: true},
        {label: 'Settings', icon: faCog, route: '/settings',disabled: true},
        { label: 'Help & support', icon: faQuestionCircle, route: '/support',disabled: true },

    ];

    logout() {
        this.authService.logout();
    }
}
