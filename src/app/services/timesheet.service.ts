import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private baseUrl = 'https://employmeindiaapidev.v2soft.com/api/';
  private authToken: string | null = null; // Store the JWT token here

  constructor(private http: HttpClient) { }

  getToken(): Observable<any> {
    const authData = {
      username: 'admin',
      password: '!o_S-MJQttBo'
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Client-service', 'frontend-client')
      .set('Auth-key', 'c6fefec67f4edbf2260c42b0ea116474');

      return this.http.post<any>(`${this.baseUrl}token`, authData, { headers }).pipe(
        tap(response => console.log('Login API Response:', response))
      );
  }

  setAuthToken(tokenResponse: any): void {
    const token = tokenResponse.token;
    console.log('Storing token in session storage:', token);
    sessionStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    // Retrieve the token from local storage or session
    return sessionStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const authToken = this.getAuthToken();
    if (authToken) {
      const headers = new HttpHeaders().set('Auth', authToken);
      return headers;
    } else {
      return new HttpHeaders();
    }
  }

  /* For employee login */
  authenticate(username: string, password: string): Observable<any> {
    const authData = {
      username: username,
      password: password
    };

    // Get the stored token from the service
    const headers = this.getAuthHeaders()
      .set('Content-Type', 'application/json')
      .set('Client-service', 'frontend-client')
      .set('Auth-key', 'c6fefec67f4edbf2260c42b0ea116474')
      .set('User-ID', '1');

    // Log the request body and headers
    console.log('Request Body:', authData);
    console.log('Request Headers:');
    headers.keys().forEach((key) => {
      console.log(`${key}: ${headers.get(key)}`);
    });
    console.log('Username before setting in session storage:', username);
    sessionStorage.setItem('username', username);

    return this.http.post<any>(`${this.baseUrl}/api/employeelogin`, authData, { headers: headers });
  }

  /* For getting the user details */
  getLoggedInUserDetails(username: string): Observable<any> {
    const headers = this.getAuthHeaders()
      .set('Content-Type', 'application/json')
      .set('Client-service', 'frontend-client')
      .set('Auth-key', 'c6fefec67f4edbf2260c42b0ea116474')
      .set('User-ID', '1');

    console.log('Request Headers:');
    headers.keys().forEach((key) => {
      console.log(`${key}: ${headers.get(key)}`);
    });

    

    // Call the API to fetch the logged-in user's details based on the username
    return this.http.post<any>(`${this.baseUrl}/api/getemployee`, {}, { headers: headers }).pipe(
      map(response => {
        if (response && Array.isArray(response.supervisordetails)) {
          const loggedInUserDetail = response.supervisordetails.find((detail: any) => detail.employee_username === username);

          // store the employee id in session
          if (loggedInUserDetail) {
            sessionStorage.setItem('employeeId', loggedInUserDetail.employee_id);
            const employeeId = sessionStorage.getItem('employeeId');
            console.log('Employee ID:', employeeId);
          }

          return loggedInUserDetail || null;
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Error in getLoggedInUserDetails:', error);
        return of(null);
      })
    );
  }

  /* for logout section */
  logout(): void {
    sessionStorage.removeItem('authToken');
  }

}
