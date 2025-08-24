import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderSummeryPanelComponent} from './order-summery-panel.component';

describe('OrderSummeryPanelComponent', () => {
  let component: OrderSummeryPanelComponent;
  let fixture: ComponentFixture<OrderSummeryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummeryPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSummeryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
