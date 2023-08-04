import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TimesheetService } from 'src/app/services/timesheet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router, private timesheetService: TimesheetService){}

  goToLogin() {
    this.timesheetService.logout();
    this.router.navigate(['/loginpage']);
  }

}
