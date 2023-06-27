import { Component, OnInit, Input, OnChanges, HostBinding, Output, EventEmitter } from '@angular/core';
import { DateDifference, MonthGridData } from '../interfaces';
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
  @Input() collapsed: boolean = true;

  @HostBinding('class.collapsed') monthCollapsed: boolean = true;

  @Output() changeState = new EventEmitter<boolean>();

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
    this.monthCollapsed = this.collapsed;
  }

  ngOnChanges(): void {
    this.constructMonth();
    this.monthCollapsed = this.collapsed;
  }

  constructMonth(): void {
    this.monthName = this.calendar.getMonthName(this.month);
    this.monthNumStr = this.calendar.getMonthNumberStr(this.month);
    this.yearNumStr = this.calendar.getYearNumberStr(this.year);
    this.constructMonthGrid();
  }

  constructMonthGrid(): void {

    let grid: MonthGridData = this.calendar.getMonthGridData(this.year, this.month);
    this.monthGridArray = [];

    // Empty blocks before 1st day of the month
    for(let i = 0; i < grid.daysBefore; i++) {
      this.monthGridArray.push(0);
    }
    
    // Each day of the month
    for(let i = 0; i < grid.daysInMonth; i++) {
      this.monthGridArray.push(i + 1);
    }

    // Empty blocks after last day of the month
    for(let i = 0; i < grid.daysAfter; i++) {
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

  toggleMonth(): void {
    this.monthCollapsed = !this.monthCollapsed;
    this.changeState.emit(this.monthCollapsed);
  } 
}
