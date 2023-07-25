import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Interface for TableRow (you can add more properties as needed)
interface TableRow {
  project: string;
  hours: string[];
}

@Component({
  selector: 'app-timesheet-report',
  templateUrl: './timesheet-report.component.html',
  styleUrls: ['./timesheet-report.component.css']
})

export class TimesheetReportComponent implements OnInit {

  // Assuming you have this variable with data for each day's hours
  tableData: TableRow[] = [];

  // The displayed days will change based on the selected date range
  displayedDays: number[] = [];
  selectedDateRange: string = ''; // Default value
  @ViewChild('table') table!: ElementRef;
  projects: string[] = [
    'Uprime',
    'Uprime R&D',
    'Open Therapeutics',
    'Shankar Distillers',
    'Vacations',
    'Holidays'
    // Add more project options if needed
  ];


  constructor(private router: Router) { }

  ngOnInit(): void {
    this.showFirst15Days();
  }

  updateButtons() {
    // Extract the month and year from the selected date range
    const [startDate, endDate] = this.selectedDateRange.split(' to ');
    const [startDay, startMonth, startYear] = startDate.split('-');
    const [endDay, endMonth, endYear] = endDate.split('-');
    // Format the button text based on the selected date range
    const buttonText = `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`;

    // Update the button text
    this.selectedDateRange = buttonText;
  }

  showFirst15Days() {
    // Set the displayed days to the first 15 days
    this.displayedDays = Array.from({ length: 15 }, (_, i) => i + 1);
    this.tableData = this.getPlaceholderData(15);
    this.updateButtons();
  }

  showRemainingDays() {
    // Set the displayed days to the remaining days (16 to 31)
    this.displayedDays = Array.from({ length: 16 }, (_, i) => i + 16);
    this.tableData = this.getPlaceholderData(16);
    this.updateButtons();
  }

  getPlaceholderData(numDays: number): TableRow[] {
    const placeholderData: TableRow[] = [];
    for (let i = 0; i < this.projects.length; i++) {
      const row: TableRow = {
        project: this.projects[i],
        hours: Array.from({ length: numDays }, () => '0.00')
      };
      placeholderData.push(row);
    }
    return placeholderData;
  }

  // Helper function to calculate total hours for a row
  getTotalHours(hours: string[]): number {
    return hours.reduce((acc, val) => acc + parseFloat(val), 0);
  }

  exportToExcel(event: Event) {
    // Prepare the data for the Excel file
    const data: any[] = [];
    const headerRow: any[] = [];
    const rows: any[] = this.tableData;
    const headers = this.displayedDays.map(day => `D${day}`);
  
    // Create the header row
    headerRow.push('Project Name', ...headers, 'Total Hours');
    data.push(headerRow);
  
    // Create data rows
    for (const row of rows) {
      const dataRow: any[] = [];
      dataRow.push(row.project, ...row.hours, this.getTotalHours(row.hours));
      data.push(dataRow);
    }
  
    // Create the workbook and worksheet
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  
    // Add the worksheet to the workbook
    workbook.SheetNames.push('Timesheet_Data');
    workbook.Sheets['Timesheet_Data'] = worksheet;
  
    // Convert the workbook to an Excel file and download it
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timesheet_data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);

    event.preventDefault();
  }

printTableAsPdf(event: Event) {
  window.print();
  event.preventDefault();
}
  
  goToDashboard() {
    this.router.navigate(['/my-timesheets']);
  }

}
