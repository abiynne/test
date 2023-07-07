import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSubmittedTimesheetComponent } from './last-submitted-timesheet.component';

describe('LastSubmittedTimesheetComponent', () => {
  let component: LastSubmittedTimesheetComponent;
  let fixture: ComponentFixture<LastSubmittedTimesheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastSubmittedTimesheetComponent]
    });
    fixture = TestBed.createComponent(LastSubmittedTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
