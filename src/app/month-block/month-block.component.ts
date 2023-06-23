import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DateDifference } from '../interfaces';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-month-block',
  templateUrl: './month-block.component.html',
  styleUrls: ['./month-block.component.css']
})
export class MonthBlockComponent implements OnInit, OnChanges {

  constructor(private calendar: CalendarService) { }

  @Input() year!: number;
  @Input() month!: number;

  monthName: string = '';
  monthNumStr: string = '';
  yearNumStr: string = '';
  monthGridArray: number[] = [];

  weekdays = this.calendar.names.weekdays;
  weekdayHovered: number | undefined;

  hoveredDateDifference: DateDifference = {d: 0, w: 0, m: 0, y: 0};
  yearToday: number = new Date().getFullYear();

  ngOnInit(): void {
    this.constructMonth();
  }

  ngOnChanges(): void {
    this.constructMonth();
  }

  constructMonth(): void {
    this.monthName = this.calendar.getMonthName(this.month);
    this.monthNumStr = this.calendar.getMonthNumberString(this.month);
    this.yearNumStr = this.calendar.getYearNumberString(this.year);
    this.constructMonthGrid();
  }

  constructMonthGrid(): void {

    let mStart: Date = this.calendar.constructDate(this.year, this.month);

    let daysBefore: number = (mStart.getDay() || 7) - 1;
    let daysInMonth: number = new Date(mStart.getFullYear(), this.month + 1, 0).getDate();
    let daysAfter: number = 7 - ((daysBefore + daysInMonth) % 7 || 7); //+ (daysBefore + daysInMonth < 36 ? 7 : 0);

    this.monthGridArray = [];

    // Empty blocks before 1st day of the month
    for(let i = 0; i < daysBefore; i++) {
      this.monthGridArray.push(0);
    }
    
    // Each day of the month
    for(let i = 0; i < daysInMonth; i++) {
      this.monthGridArray.push(i + 1);
    }

    // Empty blocks after last day of the month
    for(let i = 0; i < daysAfter; i++) {
      this.monthGridArray.push(0);
    }
  }

  setHoveredWeekday(n: number | undefined): void {
    this.weekdayHovered = n;
  }

  updateHoveredDateDifference(day?: number): void {

    if (!day) return;

    let dHovered: Date = 
      this.calendar.constructDate(this.year, this.month, day);

    this.hoveredDateDifference = 
      this.calendar.getDifferenceFromToday(dHovered);
  }
}
