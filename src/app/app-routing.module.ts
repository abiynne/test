import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatetimesheetComponent } from './components/createtimesheet/createtimesheet.component';
import { LastTimesheetComponent } from './components/last-timesheet/last-timesheet.component';
import { LastSubmittedTimesheetComponent } from './components/last-submitted-timesheet/last-submitted-timesheet.component';
import { MyTimesheetsComponent } from './components/my-timesheets/my-timesheets.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';


const routes: Routes = [
  { path: '', redirectTo: '/loginpage', pathMatch: 'full' },
  { path: 'loginpage', component: LoginpageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'createtimesheet', component: CreatetimesheetComponent },
  { path: 'last-timesheet', component: LastTimesheetComponent },
  { path: 'last-submitted-timesheet', component: LastSubmittedTimesheetComponent },
  { path: 'my-timesheets', component: MyTimesheetsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
