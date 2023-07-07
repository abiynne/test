import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {private apiUrl = 'https://api.example.com/user'; // Replace with your API URL

constructor(private http: HttpClient) { }

getUserDetails() {
  return this.http.get(this.apiUrl);
}
}
