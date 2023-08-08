import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import lottie from 'lottie-web';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-createtimesheet',
  templateUrl: './createtimesheet.component.html',
  styleUrls: ['./createtimesheet.component.css']
})

export class CreatetimesheetComponent implements OnInit, AfterViewInit {
  selectedDate: NgbDateStruct;
  minDate: NgbDate;
  maxDate: NgbDate;
  showFirstHalf: boolean = true;
  highlightedRangeStart!: NgbDate;
  highlightedRangeEnd!: NgbDate;
  dropdownLabel: string = '';
  isContactCardVisible: boolean = false; // for contact card
  contactCardContent: SafeHtml | null = null; //for contact card content
  daysOfWeek: Date[] = [];
  weekDays: number[] = [1, 2, 3, 4, 5, 6, 7];
  weeks: { start: number; end: number, month: string }[] = [];
  defaultTotalSum: string = '0.00';
  rows: any[] = []; //for DOM add or remove rows
  @ViewChild('arrowButton', { static: false }) arrowButton!: ElementRef<HTMLButtonElement>;
  // @ViewChild('dropdownLabelContainer', { static: false }) dropdownLabelContainer!: ElementRef<HTMLSpanElement>;

  isLeftSectionVisible: boolean = false;
  selectedWeek: string;
  totalSum: number = 0;
  columnTotalSum: number[] = [];
  isModalVisible = false;
  // for adding rows based on the dropdown count
  selectedProject: string = '';
  user: any;
  projectName: string[] = [''];


  constructor(private timesheetService: TimesheetService, private calendar: NgbCalendar, private dateParser: NgbDateParserFormatter, private sanitizer: DomSanitizer, private router: Router) {
    const today = this.calendar.getToday();
    this.selectedDate = today;
    this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y', 5) as NgbDate; // Update to 10 years before current year
    this.maxDate = this.calendar.getNext(this.calendar.getToday(), 'y', 5) as NgbDate; // Update to 10 years before current year
    this.showFirstHalf = true;
    this.updateHighlightedRange();
    this.highlightedRangeEnd = {} as NgbDate;
    this.highlightedRangeStart = {} as NgbDate;
    this.generateWeekDays();
    this.selectedWeek = '';

  }

  ngOnInit() {
    this.generateWeekDays();
    this.addRow(); // Add an initial row when the component initializes
    this.generateWeekButtons();

    // Get the current date
    const currentDate = this.selectedDate.day;

    // Find the week range that includes the current date
    const currentWeek = this.weeks.find(week => week.start <= currentDate && week.end >= currentDate);

    if (currentWeek) {
      this.showDays(currentWeek);
    }

    // Fetch the logged-in user details from the service and store them in the 'user' variable
    const loggedInUsername = sessionStorage.getItem('username');
    if (loggedInUsername) {
      this.timesheetService.getLoggedInUserDetails(loggedInUsername).pipe(
        switchMap(user => {
          console.log('Logged-in User Details:', user);
          this.user = user; // Store the user details
          return this.timesheetService.getLoggedInUserAndProjectNames(); // Fetch project names
        })
      ).subscribe(
        projectNames => {
          if (projectNames) {
            console.log('Matching Project Names:', projectNames);
            this.projectName = projectNames;
          } else {
            console.log('No matching projects found.');
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    } else {
      console.log('No logged-in username found in session storage.');
    }
  }

  ngAfterViewInit() {
    const inputs = $('input[type="text"]');
    const totalSum = $('#totalSum');
    const buttonElement = this.arrowButton.nativeElement;
    const animationContainer = buttonElement.querySelector('.animation-container') as Element;  // for lottie animation

    inputs.on('input', () => {
      let sum = 0;
      inputs.each((index, input) => {
        const value = parseFloat($(input).val() as string);
        if (!isNaN(value)) {
          sum += value;
        }
      });
      totalSum.text(sum.toFixed(2));
    });


    // for lottie animations
    const animation = lottie.loadAnimation({
      container: animationContainer,
      path: 'assets/lottie/right-arrow-scroll.json', // Replace with your right arrow animation JSON file path
      renderer: 'svg',
      loop: true,
      autoplay: true
    });
  }

  toggleLeftSection() {
    this.isLeftSectionVisible = !this.isLeftSectionVisible;
  }
  

  isCurrentDate(date: NgbDate): boolean {
    const currentDate = new Date();
    return (
      date.year === currentDate.getFullYear() &&
      date.month === currentDate.getMonth() + 1 &&
      date.day === currentDate.getDate()
    );
  }

  addRow() {
    const dropdownCount = this.projectName.length;
    if (this.rows.length < dropdownCount) {
      const newRow: { project: string, hours: string[] } = { project: this.selectedProject, hours: [] };
      for (let i = 0; i < this.daysOfWeek.length; i++) {
        newRow.hours.push('');
      }
      this.rows.push(newRow);
      const newRowIdx = this.rows.length - 1;
      this.clearTextFields(newRowIdx); 
      this.calculateTotalSum();
    }
  }
  

  deleteRow(index: number) {
    if (index > 0) {
      this.rows.splice(index, 1); // Remove the row at the specified index
      this.updateTotalSum();
    }
  }

  calculateTotalSum() {
    this.rows.forEach((row, rowIndex) => {
      let sum = 0;
      const inputs = $(`#row-${rowIndex} input[type="text"]`);

      inputs.each((index, input) => {
        const value = parseFloat($(input).val() as string);
        if (!isNaN(value)) {
          sum += value;
        }
      });

      const totalSum = $(`#totalSum-${rowIndex}`);
      totalSum.text(sum.toFixed(2));

      row.total = sum; // Update the total property of the row

      this.updateTotalSum(); // Update the totalSum property
    });
  }

  // for lat column total sum calculation
  updateTotalSum() {
    let sum = 0;
    this.rows.forEach((row) => {
      sum += row.total || 0;
    });
    this.totalSum = sum;
  }


  calculateRowTotal(hours: string[]): string {
    let sum = 0;
    for (let i = 0; i < hours.length; i++) {
      const value = parseFloat(hours[i]);
      if (!isNaN(value)) {
        sum += value;
      }
    }
    return sum.toFixed(2);
  }

  calculateColumnTotal(weekDay: number): string {
    let sum = 0;
    this.rows.forEach((row) => {
      const value = parseFloat(row.hours[weekDay - 0]) || 0; // Consider empty text field as 0
      if (!isNaN(value)) {
        sum += value;
      }
    });
    this.columnTotalSum[weekDay - 1] = sum; // Update the column total sum in the array
    return sum.toFixed(2);
  }

  shouldInputBeReadonly(day: Date): boolean {
    const currentDay = new Date();
    const selectedDay = new Date(this.selectedDate.year, this.selectedDate.month - 1, day.getDate());

    const isFirstHalfSelected = this.showFirstHalf;
    const isCurrentDayInFirstHalf = currentDay.getDate() <= 15;

    if ((isFirstHalfSelected && isCurrentDayInFirstHalf) || (!isFirstHalfSelected && !isCurrentDayInFirstHalf)) {
        // Current day lies in the same half as selected or in the future half
        return false;
    } else {
        // Current day is in a different half, make the input readonly
        return true;
    }
}

  // for clearing the input that was entered from th text field and from sum  field
  clearTextFields(rowIndex: number) {
    const rowInputs = $(`#row-${rowIndex} input[type="text"]`);
    const rowTotalElement = $(`#totalSum-${rowIndex}`);
    
    rowInputs.val('');
    rowTotalElement.text('0.00');

    const selectElement = $(`#row-${rowIndex} select.form-select`);
    selectElement.prop('selectedIndex', 0);

    // Clear the column total values for the cleared row
    for (let weekDay = 0; weekDay < this.daysOfWeek.length; weekDay++) {
      const value = parseFloat(this.rows[rowIndex].hours[weekDay]) || 0;
      this.columnTotalSum[weekDay] -= value;
      this.rows[rowIndex].hours[weekDay] = ''; // Clear the text field value
    }

    // Update the column total elements in the UI
    for (let weekDay = 0; weekDay < this.daysOfWeek.length; weekDay++) {
      const columnTotal = this.columnTotalSum[weekDay].toFixed(2);
      const columnTotalElement = $(`#totalSum-${weekDay}`);
      columnTotalElement.text(columnTotal);
    }

    this.calculateTotalSum(); // Recalculate the total sum
}


  generateWeekDays() {
    const startDate = this.getDaysOfWeek(this.selectedDate);
    const startDay = this.showFirstHalf ? 1 : 16;
    const endDay = this.showFirstHalf ? 15 : new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const daysOfWeek: Date[] = [];

    for (let i = startDay; i <= endDay; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), i);
      daysOfWeek.push(date);
    }

    this.daysOfWeek = daysOfWeek;
  }

  getDaysOfWeek(date: NgbDateStruct): Date {
    const weekStartDay = 1; // Assuming week starts on Monday
    const selectedDate = new Date();
    const selectedDay = selectedDate.getDay();

    const diff = selectedDay >= weekStartDay ? selectedDay - weekStartDay : 7 - (weekStartDay - selectedDay);
    const weekStartDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - diff);

    return weekStartDate;
  }

  showDays(week: { start: number, end: number, month: string }) {
    const startDate = this.getDaysOfWeek(this.selectedDate);
    const startDay = week.start;
    const endDay = week.end;
    const daysOfWeek: Date[] = [];

    for (let i = startDay; i <= endDay; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), i);
      daysOfWeek.push(date);
    }

    this.daysOfWeek = daysOfWeek;
  }

  prevMonth() {
    this.selectedDate = this.calendar.getPrev(this.selectedDate as NgbDate, 'm', 1);
    this.updateMinMaxDates();
    this.updateHighlightedRange();
    this.updateDropdownLabel();
    this.generateWeekButtons();
    this.generateWeekDays(); // new method
    
  }

  nextMonth() {
    this.selectedDate = this.calendar.getNext(this.selectedDate as NgbDate, 'm', 1);
    this.updateMinMaxDates();
    this.updateHighlightedRange();
    this.updateDropdownLabel();
    this.generateWeekButtons();
    this.generateWeekDays(); //new method
  }

  isDayActive(date: NgbDate): boolean {
    const day = date.day;
    const currentMonth = date.month;
    const currentYear = date.year;
    const currentDate = new Date();
    const isActive = day <= currentDate.getDate() && currentMonth === currentDate.getMonth() + 1 && currentYear === currentDate.getFullYear();
    if (isActive) {
      this.updateDropdownLabel();
    }
    return isActive;
  }

  updateDropdownLabel() {
    this.dropdownLabel = this.getDropdownLabel();
  }

  getLastDayOfMonth(): string {
    const lastDayOfMonth = new Date(this.selectedDate.year, this.selectedDate.month, 0).getDate();
    return lastDayOfMonth.toString().padStart(2, '0');
  }

  getCurrentMonthName(): string {
    const month = this.selectedDate?.month;
    return this.getMonthName(month);
  }

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  }


  updateMinMaxDates() {
    const startOfYear = NgbDate.from({ year: 2020, month: 1, day: 1 }) as NgbDate; // Update start year
    const endOfYear = NgbDate.from({ year: 2030, month: 12, day: 31 }) as NgbDate; // Update end year

    const startOfMonth = NgbDate.from({ year: this.selectedDate.year, month: this.selectedDate.month, day: 1 }) as NgbDate;
    const lastDayOfMonth = new Date(this.selectedDate.year, this.selectedDate.month, 0).getDate();
    const endOfMonth = NgbDate.from({ year: this.selectedDate.year, month: this.selectedDate.month, day: lastDayOfMonth }) as NgbDate;

    this.minDate = startOfYear; // Update minDate to startOfYear
    this.maxDate = endOfYear; // Update maxDate to endOfYear

    // Update minDate and maxDate within the month
    if (startOfMonth.after(this.minDate)) {
      this.minDate = startOfMonth;
    }
    if (endOfMonth.before(this.maxDate)) {
      this.maxDate = endOfMonth;
    }
  }

  // for drop down support
  getDropdownLabel(): string {
    const currentDay = this.selectedDate.day;
    const currentMonth = this.selectedDate.month;
    const currentYear = this.selectedDate.year;

    const startDate = 1;
    const endDate = 15;

    if (currentDay >= startDate && currentDay <= endDate && currentMonth === this.selectedDate.month) {
      return `${startDate}-${this.getCurrentMonthName().substr(0, 3)}-${currentYear} to ${endDate}-${this.getCurrentMonthName().substr(0, 3)}-${currentYear}`;
    } else {
      const lastDayOfMonth = this.getLastDayOfMonth();
      return `16-${this.getCurrentMonthName().substr(0, 3)}-${currentYear} to ${lastDayOfMonth}-${this.getCurrentMonthName().substr(0, 3)}-${currentYear}`;
    }
  }

  selectFirstHalf() {
    // Set the showFirstHalf variable to true
    this.showFirstHalf = true;

    // Update the highlighted range
    this.updateHighlightedRange();
  }

  updateHighlightedRange() {
    // Get the start and end dates of the highlighted range
    const startOfMonth = NgbDate.from({ year: this.selectedDate.year, month: this.selectedDate.month, day: 1 }) as NgbDate;
    const lastDayOfMonth = new Date(this.selectedDate.year, this.selectedDate.month, 0).getDate();
    const highlightedRangeEndDay = this.showFirstHalf ? 15 : lastDayOfMonth;
    this.highlightedRangeStart = startOfMonth;
    this.highlightedRangeEnd = NgbDate.from({ year: this.selectedDate.year, month: this.selectedDate.month, day: highlightedRangeEndDay }) as NgbDate;
  }

  selectSecondHalf() {
    this.showFirstHalf = false;
  }

  isFirstHalf(date: NgbDate): boolean {
    const day = date.day;
    return this.showFirstHalf ? day <= 15 : day > 15;
  }

  isHighlighted(date: NgbDate): boolean {
    const day = date.day;
    const month = date.month;
    const year = date.year;

    if (this.showFirstHalf) {
      const startDate = 1;
      const endDate = 15;
      return day >= startDate && day <= +endDate && month === this.selectedDate.month && year === this.selectedDate.year;
    } else {
      const startDate = 16;
      const endDate = +this.getLastDayOfMonth();
      return day >= startDate && day <= endDate && month === this.selectedDate.month && year === this.selectedDate.year;
    }
  }

  isFirstHalfSelected(): boolean {
    return this.showFirstHalf;
  }

  showFirstHalff() {
    this.showFirstHalf = true;
    this.generateWeekDays();
  }

  showSecondHalf() {
    this.showFirstHalf = false;
    this.generateWeekDays();
  }

  // for week buttons on right side
  generateWeekButtons() {
    const startDate = this.getDaysOfWeek(this.selectedDate);
    const weeks: { start: number; end: number; month: string }[] = [];
    const currentDate = new Date();

    let currentDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 1); // Start from the first day of the week

    while (weeks.length < 6 && currentDay.getMonth() === this.selectedDate.month - 0) {
      const weekStart = currentDay.getDate();
      const weekMonth = this.getMonthName(currentDay.getMonth() + 1);
      currentDay.setDate(currentDay.getDate() + 6);
      const weekEnd = currentDay.getDate();
      weeks.push({ start: weekStart, end: weekEnd, month: weekMonth });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    this.weeks = weeks;
    const currentWeek = weeks.find(
      (week) =>
        week.start <= currentDate.getDate() &&
        week.end >= currentDate.getDate() &&
        week.month === this.getMonthName(this.selectedDate.month)
    );

    if (currentWeek) {
      this.showDays(currentWeek);
    }
  }

  // for text box validation
  isValidInput(value: string): boolean {
    const numericValue = Number(value);
    return value === '' || (!isNaN(numericValue) && Number.isInteger(numericValue));
  }

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
