import {Component, EventEmitter, HostListener, inject, Output, signal} from '@angular/core';
import {CustomerService} from "../../../customers/services/customers.service";
import {take} from "rxjs/operators";
import {CustomerDTO} from "../../interface/customer.entity";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-customer-search',
  imports: [
    FormsModule
  ],
  templateUrl: './customer-search.component.html',
  standalone: true,
  styleUrl: './customer-search.component.scss'
})
export class CustomerSearchComponent {
  @Output() shopSelected = new EventEmitter<CustomerDTO>();
  customerService = inject(CustomerService);
  searchText = signal('');
  filteredShops = signal<CustomerDTO[]>([]);
  isListVisible = signal(false);
  selectedShop = signal<CustomerDTO | null>(null);

  filterShops(searchValue: string): void {
    this.searchText.set(searchValue);
    this.find(searchValue);
  }

  private find(searchText: string): void {
    this.customerService.find({
      shop_code: '',
      short_name: '',
      full_name: searchText,
      route_name: '',
      page_number: 1,
      items_per_page: 5
    }, true).pipe(
        take(1)
    ).subscribe({
      next: (response) => {
        this.filteredShops.set(response.data.data || []);
      },
      error: () => {
        this.filteredShops.set([]);
      }
    });
  }

  handleShopChange(shop: CustomerDTO, event: Event): void {
    event.stopPropagation();
    this.selectedShop.set(shop);
    this.searchText.set(`${shop.cRef} - ${shop.shortName || shop.fullName}`);
    this.shopSelected.emit(shop);
    this.isListVisible.set(false);
  }

  @HostListener('document:click')
  onClickOutside(): void {
    this.isListVisible.set(false);
  }
}