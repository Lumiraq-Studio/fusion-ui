import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ReportDownloadComponent} from "./components";

const routes: Routes = [
  {
    path: '',
    component: ReportDownloadComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportsModule { }
