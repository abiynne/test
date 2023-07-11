import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var $: any; // Import jQuery
@Component({
  selector: 'app-last-timesheet',
  templateUrl: './last-timesheet.component.html',
  styleUrls: ['./last-timesheet.component.css']
})
export class LastTimesheetComponent implements OnInit, AfterViewInit {
  selectedOption: string = '';
  dropdownOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  weeks: string[] = []; // for weeks
  weekDays: number[] = [1, 2, 3, 4, 5, 6, 7];
  defaultTotalSum: string = '0.00';

  ngOnInit() {
    // Initialize popover after the component is initialized
    $(document).ready(() => {
      $('[data-bs-toggle="popover"]').popover();
    });
  }

  ngAfterViewInit() {
    // Destroy popover when the component is destroyed to prevent memory leaks
    $(document).ready(() => {
      $('[data-bs-toggle="popover"]').on('hidden.bs.popover', () => {
        $(this).popover('dispose');
      });
    });
  }

  onSelectionChange(event: any) {
    // Do something with the selected option
    console.log(event.value);
  }
}
