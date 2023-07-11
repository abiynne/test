import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';
import lottie from 'lottie-web';


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
  weeks: string[] = []; // for weeks
  isContactCardVisible: boolean = false; // for contact card
  contactCardContent: SafeHtml = '';
  daysOfWeek!: Date[]; // Array to hold days of the week
  weekDays: number[] = [1, 2, 3, 4, 5, 6, 7];
  defaultTotalSum: string = '0.00';
  @ViewChild('yourButton', { static: false }) yourButton!: ElementRef<HTMLButtonElement>;


  constructor(private calendar: NgbCalendar, private dateParser: NgbDateParserFormatter, private sanitizer: DomSanitizer) {
    const today = this.calendar.getToday();
    this.selectedDate = today;
    this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y', 5) as NgbDate; // Update to 10 years before current year
    this.maxDate = this.calendar.getNext(this.calendar.getToday(), 'y', 5) as NgbDate; // Update to 10 years before current year
    this.showFirstHalf = true;
    this.updateHighlightedRange();
    this.highlightedRangeEnd = {} as NgbDate;
    this.highlightedRangeStart = {} as NgbDate;
    this.generateWeekButtons();

  }

  ngOnInit() {
    this.contactCardContent = this.sanitizer.bypassSecurityTrustHtml(`
      <div class="card" style="width: 18rem;">
        <div class="card-header">
          <i class="bi bi-person-circle text-primary" style="font-size: 80px;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title">Shinto Chandy</h5>
          <p class="card-text">Mobile: 1234567890</p>
          <p class="card-text">Work: 9876543210</p>
          <p class="card-text">Email: example@example.com</p>
        </div>
      </div>
    `);
    this.daysOfWeek = this.getDaysOfWeek();
  }

  ngAfterViewInit() {
    const inputs = $('input[type="text"]');
    const totalSum = $('#totalSum');
    const buttonElement = this.yourButton.nativeElement;
    const animationContainer = buttonElement.querySelector('.animation-container') as Element;

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

  // for clearing the input that was entered from th text field and from sum  field
  clearTextFields() {
    const inputs = $('input[type="text"]');
    inputs.val(''); // Clear the input field values

    let sum = 0;
    inputs.each((index, input) => {
      const value = parseFloat($(input).val() as string);
      if (!isNaN(value)) {
        sum += value;
      }
    });
    $('#totalSum').text(sum.toFixed(2));
  }

  showContactCard(contactCard: any) {
    contactCard.open();
  }

  hideContactCard(contactCard: any) {
    contactCard.close();
  }

  getDaysOfWeek(): Date[] {
    const startDate = new Date(); // Use the desired start date
    const daysOfWeek: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      daysOfWeek.push(date);
    }

    return daysOfWeek;
  }

  prevMonth() {
    this.selectedDate = this.calendar.getPrev(this.selectedDate as NgbDate, 'm', 1);
    this.updateMinMaxDates();
    this.updateHighlightedRange();
    this.updateDropdownLabel();
  }

  nextMonth() {
    this.selectedDate = this.calendar.getNext(this.selectedDate as NgbDate, 'm', 1);
    this.updateMinMaxDates();
    this.updateHighlightedRange();
    this.updateDropdownLabel();
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
    const startDay = 1;
    const lastDayOfMonth = new Date(this.selectedDate.year, this.selectedDate.month, 0).getDate();
    const monthName = this.getMonthName(this.selectedDate.month);

    if (this.showFirstHalf) {
      const startDate = '01';
      const endDate = '15';
      return `${startDate}-${monthName.substr(0, 3)}-${this.selectedDate.year} to ${endDate}-${monthName.substr(0, 3)}-${this.selectedDate.year}`;
    } else {
      const startDate = '16';
      const endDate = lastDayOfMonth.toString().padStart(2, '0');
      return `${startDate}-${monthName.substr(0, 3)}-${this.selectedDate.year} to ${endDate}-${monthName.substr(0, 3)}-${this.selectedDate.year}`;
    }
  }

  selectFirstHalf() {
    this.showFirstHalf = true;
  }

  selectSecondHalf() {
    this.showFirstHalf = false;
  }

  isFirstHalf(date: NgbDate): boolean {
    const day = date.day;
    return this.showFirstHalf ? day <= 15 : day > 15;
  }

  updateHighlightedRange() {
    const startOfMonth = NgbDate.from({ year: this.selectedDate.year, month: this.selectedDate.month, day: 1 }) as NgbDate;
    const lastDayOfMonth = new Date(this.selectedDate.year, this.selectedDate.month, 0).getDate();
    const highlightedRangeEndDay = this.showFirstHalf ? 15 : lastDayOfMonth;
    this.highlightedRangeStart = startOfMonth;
    this.highlightedRangeEnd = NgbDate.from({ year: this.selectedDate.year, month: this.selectedDate.month, day: highlightedRangeEndDay }) as NgbDate;
  }

  isHighlighted(date: NgbDate): boolean {
    const day = date.day;
    const currentMonth = date.month;
    const isFirstHalf = day >= 1 && day <= 15;
    return isFirstHalf && currentMonth === this.selectedDate.month;
  }

  // for week buttons on right side
  generateWeekButtons() {
    const currentMonth = this.selectedDate.month - 1;
    const currentYear = this.selectedDate.year;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const firstWeekStartDate = 1;
    const lastWeekEndDate = lastDayOfMonth.getDate();
    let weekStart = firstWeekStartDate;
    let weekEnd = Math.min(firstWeekStartDate + 6, lastWeekEndDate);

    this.weeks = [];

    while (weekStart <= lastWeekEndDate) {
      const startMonth = this.getMonthName(currentMonth + 1).substr(0, 3);
      const endMonth = this.getMonthName(currentMonth + 1).substr(0, 3);
      const weekRange = `${weekStart} ${startMonth} to ${weekEnd} ${endMonth}`;
      this.weeks.push(weekRange);

      weekStart = weekEnd + 1;
      weekEnd = Math.min(weekStart + 6, lastWeekEndDate);
    }
  }

}

