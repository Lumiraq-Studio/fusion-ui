import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {initFlowbite} from "flowbite";
import {NotificationService} from "./core";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet
    ],
    templateUrl: './app.component.html',
    standalone: true,
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private querySub: Subscription | undefined;

    constructor(
        public notificationService: NotificationService,
    ) {
    }

    get notifications() {
        return this.notificationService.notification;
    }

    ngOnInit(): void {
        initFlowbite();
    }

    ngOnDestroy(): void {
        if (this.querySub)
            this.querySub.unsubscribe();

        this.subscriptions.unsubscribe();
    }


}
