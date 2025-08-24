import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-bottom-navigation',
    imports: [],
    templateUrl: './bottom-navigation.component.html',
    standalone: true,
    styleUrl: './bottom-navigation.component.scss'
})
export class BottomNavigationComponent {
    constructor(private router: Router) {
    }

    navigate(route: string) {
        this.router.navigate([`/${route}`]);
    }

    isActive(route: string): boolean {
        return this.router.url.includes(route);
    }
}
