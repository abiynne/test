import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatetimesheetComponent } from './components/createtimesheet/createtimesheet.component';
import { TimesheetService } from './services/timesheet.service';
import { FormsModule } from '@angular/forms';
import { LastTimesheetComponent } from './components/last-timesheet/last-timesheet.component';
import { LastSubmittedTimesheetComponent } from './components/last-submitted-timesheet/last-submitted-timesheet.component';
import { MyTimesheetsComponent } from './components/my-timesheets/my-timesheets.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreatetimesheetComponent,
    LastTimesheetComponent,
    LastSubmittedTimesheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [TimesheetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
