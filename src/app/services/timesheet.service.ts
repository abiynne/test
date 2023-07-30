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

      return this.http
      .post<any>(`${this.baseUrl}token`, authData, { headers })
      .pipe(tap((response) => this.setAuthToken(response.token)));
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    // Store the token securely, e.g., in local storage or a session
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    // Retrieve the token from local storage or session
    return this.authToken || localStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );
  // If the token is available, add it to the Authorization header
  const token = this.getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

  authenticate(username: string, password: string): Observable<any> {
    const authData = {
      username: username,
      password: password
    };

    // Get the stored token from the service
    const headers = this.getAuthHeaders()
      .set('Client-Service', 'frontend-client')
      .set('Auth-Key', 'c6fefec67f4edbf2260c42b0ea116474')
      .set('User-ID', '1');

      return this.http.post<any>(`${this.baseUrl}employeelogin`, authData, {
        headers: headers,
      });
  }

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

}
