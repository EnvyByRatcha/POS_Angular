import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalePerMonthComponent } from './report-sale-per-month.component';

describe('ReportSalePerMonthComponent', () => {
  let component: ReportSalePerMonthComponent;
  let fixture: ComponentFixture<ReportSalePerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSalePerMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSalePerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
