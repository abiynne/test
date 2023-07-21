import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any; // for working with third-party libraries

interface TableRow {
  project: string;
  hours: string[];
}

@Component({
  selector: 'app-my-timesheets',
  templateUrl: './my-timesheets.component.html',
  styleUrls: ['./my-timesheets.component.css']
})
export class MyTimesheetsComponent implements OnInit {

  dateRange: string = ''; // Will hold the selected date range
  tableData: TableRow[] = []; // Will hold the data for the table
  showTable: boolean = false;

  selectedStatus: string;
  selectedProject: string = '';
  projects: string[] = [
    'Uprime',
    'Uprime R&D',
    'Open Therapeutics',
    'Shankar Distillers',
    'Vacations',
    'Holidays'
    // Add more project options if needed
  ];
  status: string[] = [
    'Approved',
    'Not Approved'
  ];
  @ViewChild('dateRangePicker') dateRangePicker!: ElementRef<HTMLInputElement>; // for clearing the date range

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize the date range picker
    $('#dateRange').daterangepicker({
      opens: 'left',
      autoApply: true
    });
  }

  search() {
    this.tableData = this.fetchTableData(this.dateRange);
    // Set displayTable to true to show the table
    this.showTable = true;
  }

  private fetchTableData(dateRange: string): TableRow[] {
    const startDate = new Date(dateRange.split(' - ')[0]);
    const endDate = new Date(dateRange.split(' - ')[1]);
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const tableData: TableRow[] = [];

    for (let i = 0; i < this.projects.length; i++) {
      const row: TableRow = {
        project: this.projects[i],
        hours: []
      };

      for (let j = 0; j <= days; j++) {
        row.hours.push('0');
      }
      tableData.push(row);
    }
    return tableData;
  }

  getDaysArray(): Date[] {
    const startDate = new Date(this.dateRange.split(' - ')[0]);
    const endDate = new Date(this.dateRange.split(' - ')[1]);
    const days = [];
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  }


  calculateTotal(hours: string[]): string {
    const total = hours.reduce((acc, val) => acc + parseFloat(val), 0);
    return total.toFixed(2);
  }

  // clear the data selected
  clearFields() {

    this.dateRangePicker.nativeElement.value = '';

    const projectSelect = document.querySelector('.form-select.small') as HTMLSelectElement;
    projectSelect.selectedIndex = 0;

    const statusSelect = document.querySelector('.form-select') as HTMLSelectElement;
    statusSelect.selectedIndex = 0;

    // Clear the table data and hide the table
    this.tableData = [];
    this.showTable = false;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
