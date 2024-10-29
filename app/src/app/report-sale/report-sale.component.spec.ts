import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSaleComponent } from './report-sale.component';

describe('ReportSaleComponent', () => {
  let component: ReportSaleComponent;
  let fixture: ComponentFixture<ReportSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
