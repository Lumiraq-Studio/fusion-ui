import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SettingsComponent} from "./components";

export * from './components'

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ]
})
export class SettingsModule {
}
