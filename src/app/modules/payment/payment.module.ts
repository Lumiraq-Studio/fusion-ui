import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {PaymentViewComponent} from "./components";

const routes: Routes = [
    {
        path: '',
        component: PaymentViewComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class PaymentModule {
}
