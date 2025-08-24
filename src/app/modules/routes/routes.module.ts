import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RouteViewComponent} from "./components";

const routes: Routes = [
    {
        path: '',
        component: RouteViewComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class RoutesModule {
}
