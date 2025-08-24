import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {NotificationViewComponent} from "./components";

const routes: Routes = [
    {
        path: '',
        component: NotificationViewComponent
    }
];


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class NotificationsModule {
}
