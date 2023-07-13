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
  @Input() weekdayShift!: number;
  @Input() collapsed: boolean = true;

  @HostBinding('class.collapsed') monthCollapsed: boolean = true;

  @Output() changeState = new EventEmitter<boolean>();

  monthName: string = '';
  monthNumStr: string = '';
  yearNumStr: string = '';
  monthGridArray: number[] = [];

  weekdays: string[] = [];
  weekdayHovered: number | undefined;

  hovDateDiff: DateDifference = {d: 0, w: 0, m: 0, y: 0};
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
    this.monthName = this.calendar.monthName(this.month);
    this.monthNumStr = this.calendar.monthNumberStr(this.month);
    this.yearNumStr = this.calendar.yearNumberStr(this.year);
    this.weekdays = this.calendar.weekdayNames(this.weekdayShift, true);
    this.constructMonthGrid();
  }

  constructMonthGrid(): void {

    let grid: MonthGridData = 
      this.calendar.getMonthGridData(this.year, this.month, this.weekdayShift);

    this.monthGridArray = Array.prototype.concat(
      Array(grid.daysBefore).fill(0),
      [...Array(grid.daysInMonth).keys()].map(i => i + 1),
      Array(grid.daysAfter).fill(0)
    );
  }

  setHoveredWeekday(n: number | undefined): void {
    this.weekdayHovered = n;
  }

  updatehovDateDiff(day?: number): void {

    if (!day) return;

    this.hovDateDiff = 
      this.calendar.getDifferenceFromToday(
        this.calendar.constructDate(this.year, this.month, day)
      );
  }

  toggleMonth(): void {
    this.monthCollapsed = !this.monthCollapsed;
    this.changeState.emit(this.monthCollapsed);
  } 
}
