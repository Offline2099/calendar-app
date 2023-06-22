import { Component, OnInit, Input, OnChanges, Output, EventEmitter, HostBinding } from '@angular/core';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-year-block',
  templateUrl: './year-block.component.html',
  styleUrls: ['./year-block.component.css']
})
export class YearBlockComponent implements OnInit, OnChanges {

  constructor(private calendar: CalendarService) { }

  @Input() year!: number;
  @Output() changeYear: EventEmitter<number> = new EventEmitter();

  @HostBinding('class.animation') animation: boolean = false;

  yearNumStr: string = '';

  months: number[] = [...Array(12).keys()];

  minYear: number = this.calendar.limits.minYear;
  maxYear: number = this.calendar.limits.maxYear;

  ngOnInit(): void {
    this.yearNumStr = this.calendar.getYearNumberString(this.year);
  }

  ngOnChanges(): void {
    this.yearNumStr = this.calendar.getYearNumberString(this.year);
    this.animation = !this.animation;
  }

  shiftYear(incr: number): void {
    this.changeYear.emit(this.year + incr);
  }

}
