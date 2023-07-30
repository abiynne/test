import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

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

  setAuthToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    // Retrieve the token from local storage or session
    return sessionStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const authToken = this.getAuthToken();
    if (authToken) {
      return new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    } else {
      return new HttpHeaders();
    }
  }

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

    return this.http.post<any>(`${this.baseUrl}employeelogin`, authData, { headers: headers });
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
  }

}
