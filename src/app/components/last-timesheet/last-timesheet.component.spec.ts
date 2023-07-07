import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTimesheetComponent } from './last-timesheet.component';

describe('LastTimesheetComponent', () => {
  let component: LastTimesheetComponent;
  let fixture: ComponentFixture<LastTimesheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastTimesheetComponent]
    });
    fixture = TestBed.createComponent(LastTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
