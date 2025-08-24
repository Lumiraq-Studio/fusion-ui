import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SalesPersonViewComponent} from "./components";

const routes: Routes = [
    {
        path: '',
        component: SalesPersonViewComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class SalesPersonModule {
}
