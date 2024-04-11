import { Component, Input, SimpleChanges, HostBinding, Output, EventEmitter } from '@angular/core';

import { DateDifference, MonthGridData } from '../interfaces';
import { CalendarService } from '../calendar.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-month-block',
  templateUrl: './month-block.component.html',
  styleUrls: ['./month-block.component.css']
})
export class MonthBlockComponent {

  constructor(
    private calendar: CalendarService,
    private settings: SettingsService) { }

  @Input() year!: number;
  @Input() month!: number;
  @Input() weekdayShift!: number;
  @Input() collapsed: boolean = true;

  @HostBinding('class.collapsed') monthCollapsed: boolean = true;

  @Output() changeState = new EventEmitter<boolean>();

  monthName: string = '';
  monthNumStr: string = '';
  yearNumStr: string = '';
  yearHue: number = 0;
  monthGridArray: number[] = [];

  weekdays: string[] = [];
  weekdayHovered: number | undefined;

  hovBlockIndex: number = -1;
  hovDateDiff: DateDifference = {d: 0, w: 0, m: 0, y: 0};
  yearToday: number = new Date().getFullYear();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year'] || changes['month'] || changes['weekdayShift'])
      this.constructMonth();
    if (changes['collapsed'])
      this.monthCollapsed = this.collapsed;
  }

  constructMonth(): void {
    this.monthName = this.calendar.monthName(this.month);
    this.monthNumStr = this.calendar.monthNumberStr(this.month);
    this.yearNumStr = this.calendar.yearNumberStr(this.year);
    this.yearHue = this.settings.getYearColor(this.year);
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

  setHoveredDate(gridIndex: number, day?: number) {

    if (day || gridIndex == -1) this.hovBlockIndex = gridIndex;

    if (day) {
      this.hovDateDiff = 
        this.calendar.getDifferenceFromToday(
          this.calendar.constructDate(this.year, this.month, day)
        );
    }
  }

  toggleMonth(): void {
    this.monthCollapsed = !this.monthCollapsed;
    this.changeState.emit(this.monthCollapsed);
  } 
}
