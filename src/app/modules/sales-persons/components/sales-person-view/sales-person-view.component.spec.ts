import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SalesPersonViewComponent} from './sales-person-view.component';

describe('SalesPersonViewComponent', () => {
  let component: SalesPersonViewComponent;
  let fixture: ComponentFixture<SalesPersonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPersonViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPersonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
