import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {InventoryViewComponent} from "./components";

const routes: Routes = [
    {
        path: '',
        component: InventoryViewComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class InventoryModule {
}
