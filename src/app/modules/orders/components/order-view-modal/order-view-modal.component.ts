import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AsyncPipe, DatePipe, DecimalPipe} from "@angular/common";
import {StatusBadgeComponent} from "../../../shared";
import {faBox, faInfoCircle, faSave, faWallet, faXmark} from "@fortawesome/free-solid-svg-icons";
import {OrderService} from "../../services/order.service";

@Component({
  selector: 'app-order-view-modal',
  imports: [
    FaIconComponent,
    DecimalPipe,
    StatusBadgeComponent,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './order-view-modal.component.html',
  standalone: true,
  styleUrl: './order-view-modal.component.scss'
})
export class OrderViewModalComponent {
  protected readonly faWallet = faWallet;
  protected readonly faXmark = faXmark;
  protected readonly faInfoCircle = faInfoCircle;
  protected readonly faBox = faBox;
  protected readonly faSave = faSave;

  @Input() isOpen = false;
  @Output() closePopup = new EventEmitter<void>();
  orderService = inject(OrderService);
  selectedOrder$ = this.orderService.$active;

  close() {
    this.closePopup.emit();
    this.orderService.initial()
  }

}
