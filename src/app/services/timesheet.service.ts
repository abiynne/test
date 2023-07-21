import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private baseUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getProjects() {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  // getUserProjects() {
  //   return this.http.get(`${this.baseUrl}/user_projects`);
  // }

  // getTimesheetData() {
  //   return this.http.get(`${this.baseUrl}/timesheet_data`);
  // }

  // getHolidays() {
  //   return this.http.get(`${this.baseUrl}/holidays`);
  // }

}
