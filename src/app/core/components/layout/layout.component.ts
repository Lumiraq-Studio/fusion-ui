import {ChangeDetectorRef, Component, computed, OnDestroy} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {NotificationService} from "../../services";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {LoadingComponent} from "../loading/loading.component";
import {NotificationAlertComponent} from "../notification/notification-alert.component";
import {Subscription} from "rxjs";
import {NgStyle} from "@angular/common";
import {SideNavComponent} from "../side-nav/side-nav.component";

@Component({
  selector: 'app-layout',
    imports: [
        RouterOutlet,
        LoadingComponent,
        NotificationAlertComponent,
        SideNavComponent
    ],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {

  private querySub: Subscription | undefined;
  private subscriptions: Subscription = new Subscription();
  sidebarCollapsed = false;


  constructor(
      protected loadingService: LoadingService,
      public notificationService: NotificationService,
      private cdr: ChangeDetectorRef
  ) {
  }
  isLoading = computed(() => this.loadingService.isLoading());

  get notifications() {
    return this.notificationService.notification;
  }

  ngOnDestroy(): void {
    if (this.querySub)
      this.querySub.unsubscribe();

    this.subscriptions.unsubscribe();
  }

  onSidebarCollapsed(isCollapsed: boolean): void {
    this.sidebarCollapsed = isCollapsed;
    this.cdr.detectChanges();
  }

}
