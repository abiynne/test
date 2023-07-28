import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TimesheetService } from 'src/app/services/timesheet.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {

  username: string;
  password: string;
  showPassword: boolean = false;
  errorMessage: string;

  constructor(private timesheetService: TimesheetService, private router: Router) { }

  login(): void {
    // Step 1: Get the Token
    this.timesheetService.getToken().pipe(
      switchMap(response => {
        const token = response.token;
        console.log('Token:', token);

        // Step 2: Store the Token
        this.timesheetService.setAuthToken(token);

        // Step 3: Use the Token in the Login Request
        const headers = this.timesheetService.getAuthHeaders();

        // Step 4: Make the login request with the token included in the headers
        return this.timesheetService.authenticate(this.username, this.password);
      })
    ).subscribe(
      () => {
        // Redirect to the dashboard page after successful login
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.errorMessage = 'Invalid username or password.';
        console.error('Authentication failed:', error);
      }
    );
  }

  logout(): void {
    // Clear the stored token when the user logs out
    this.timesheetService.logout();
    this.router.navigate(['/login']);
  }

}
