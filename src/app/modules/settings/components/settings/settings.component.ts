import {Component} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
    faBell,
    faCog,
    faCreditCard,
    faDatabase,
    faHeadset,
    faImage,
    faReceipt,
    faSave,
    faShieldAlt,
    faTruck,
    faUpload,
    faUser,
    faUserPlus,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {faBook} from "@fortawesome/free-solid-svg-icons/faBook";
import {faStore} from "@fortawesome/free-solid-svg-icons/faStore";

@Component({
    selector: 'app-settings',
    imports: [
        FaIconComponent
    ],
    templateUrl: './settings.component.html',
    standalone: true,
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {

    protected readonly faCog = faCog;
    protected readonly faBook = faBook;
    protected readonly faHeadset = faHeadset;
    protected readonly faUserPlus = faUserPlus;
    protected readonly faUser = faUser;
    protected readonly faReceipt = faReceipt;
    protected readonly faStore = faStore;
    protected readonly faUsers = faUsers;
    protected readonly faCreditCard = faCreditCard;
    protected readonly faTruck = faTruck;
    protected readonly faBell = faBell;
    protected readonly faShieldAlt = faShieldAlt;
    protected readonly faDatabase = faDatabase;
    protected readonly faSave = faSave;
    protected readonly faImage = faImage;
    protected readonly faUpload = faUpload;
}
