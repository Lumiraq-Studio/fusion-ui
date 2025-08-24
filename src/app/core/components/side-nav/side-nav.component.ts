import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgClass } from "@angular/common";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faGear,
    faShoppingCart,
    faBoxes,
    faLineChart,
    faUsers,
    faMapLocationDot,
    faPeopleGroup,
    faPeopleRoof,
    faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { SettingsStorageService } from "../../services/settings-storage.service";

@Component({
    selector: 'app-side-nav',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgClass,
        FontAwesomeModule
    ],
    templateUrl: './side-nav.component.html',
    styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {

    private settingsStorage = inject(SettingsStorageService);

    isLocked = signal(false);
    showSettings = signal(false);

    navItems = signal([
        {
            name: 'Dashboard',
            link: '/dashboard',
            icon:  undefined,
            iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
            enabled: true
        },
        {
            name: 'Sales Orders',
            link: '/orders',
            icon: faShoppingCart,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Payments',
            link: '/payments',
            icon: faCreditCard,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Inventory',
            link: '/inventory',
            icon: faBoxes,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Reports',
            link: '/reports',
            icon: faLineChart,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Customers',
            link: '/customers',
            icon: faUsers,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Routing',
            link: '/routes',
            icon: faMapLocationDot,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Sales Team',
            link: '/sales-persons',
            icon: faPeopleGroup,
            iconPath: undefined,
            enabled: true
        },
        {
            name: 'Employees',
            link: '/test',
            icon: faPeopleRoof,
            iconPath: undefined,
            enabled: false
        },
    ]);

    settingsItem = signal({
        name: 'Settings',
        link: '/settings',
        icon: faGear, // FontAwesome icon
        iconPath: undefined, // Will use FA icon since icon is provided
        enabled: true
    });

    async ngOnInit() {
        try {
            const savedSettings = await this.settingsStorage.loadSettings();
            this.isLocked.set(savedSettings.isLocked);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async toggleLock() {
        const newLockState = !this.isLocked();
        this.isLocked.set(newLockState);

        try {
            await this.settingsStorage.saveSettings({ isLocked: newLockState });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    openSettings() {
        this.showSettings.set(true);
    }

    closeSettings() {
        this.showSettings.set(false);
    }

    clearCache(): void {
        // Implement your cache clearing logic here
    }
}