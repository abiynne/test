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

  fromDate: string = '';
  toDate: string = '';
  buttonsData: { label: string, fromDate: string, toDate: string }[] = [];
  dateRange: string = ''; // Will hold the selected date range
  tableData: TableRow[] = []; // Will hold the data for the table
  showTable: boolean = false;
  selectedStatus: string;
  selectedProject: string = '';
  projects: string[] = [
    'All Projects',
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
  @ViewChild('dateRangePicker') dateRangePicker!: ElementRef<HTMLInputElement>;
  firstHalfMonth: string;
  secondHalfMonth: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize the date pickers
    $('#fromDate').daterangepicker({
      singleDatePicker: true,
      autoApply: true
    });

    $('#toDate').daterangepicker({
      singleDatePicker: true,
      autoApply: true
    });
  }

  search() {
    this.tableData = this.fetchTableData(this.dateRange);
    // Set displayTable to true to show the table
    this.showTable = true;

    this.router.navigate(['/timesheet-report'], {
      state: {
        dateRange: this.dateRange,
        projects: this.projects
      }
    });
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

  // clear the data selected
  clearFields() {
    this.dateRangePicker.nativeElement.value = '';
    const projectSelect = document.querySelector('.form-select.small') as HTMLSelectElement;
    projectSelect.selectedIndex = 0;
    const statusSelect = document.querySelector('.form-select') as HTMLSelectElement;
    statusSelect.selectedIndex = 0;

    this.tableData = [];
    this.showTable = false;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
