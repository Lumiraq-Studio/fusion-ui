import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySalesSummeryComponent } from './daily-sales-summery.component';

describe('DailySalesSummeryComponent', () => {
  let component: DailySalesSummeryComponent;
  let fixture: ComponentFixture<DailySalesSummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailySalesSummeryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailySalesSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
