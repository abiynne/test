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
      tap(response => console.log('Token Response:', response)),
      map(response => response.token)
    );
  }

  authenticate(username: string, password: string): Observable<any> {
    const authData = {
      username: username,
      password: password
    };

    const headers = this.getAuthHeaders();

    return this.http.post<any>(`${this.baseUrl}employeelogin`, authData, { headers });
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  getAuthHeaders(): HttpHeaders {
    if (this.authToken) {
      return new HttpHeaders().set('Authorization', `${this.authToken}`);
    } else {
      return new HttpHeaders();
    }
  }

  logout(): void {
    this.authToken = null;
  }

}
