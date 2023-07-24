import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timesheet_Data } from '../models/timesheet_data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private baseUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  // Method to submit the timesheet data to the server
  submitTimesheet(timesheetData: Timesheet_Data[]): Observable<any> {
    const url = `${this.baseUrl}/createtimesheet`; 
    // Send a POST request to the server with the timesheet data
    return this.http.post(url, timesheetData);
  }

}
