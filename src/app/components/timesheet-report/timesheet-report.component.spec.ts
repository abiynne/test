import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetReportComponent } from './timesheet-report.component';

describe('TimesheetReportComponent', () => {
  let component: TimesheetReportComponent;
  let fixture: ComponentFixture<TimesheetReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetReportComponent]
    });
    fixture = TestBed.createComponent(TimesheetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
