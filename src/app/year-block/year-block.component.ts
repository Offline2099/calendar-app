import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MonthGridData, YearBlockState } from '../interfaces';
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

  yearNumStr: string = '';

  minYear: number = this.calendar.limits.minYear;
  maxYear: number = this.calendar.limits.maxYear;

  months: number[] = [...Array(12).keys()];

  mGridData: MonthGridData[] = [];

  monthState: YearBlockState = {
    collapsed1Col: Array(12).fill(true),
    collapsed2Col: Array(12).fill(true),
    collapsed3Col: Array(12).fill(false),
    extraMargin2Col: Array(12).fill(false),
    extraMargin3Col: Array(12).fill(false)
  }

  animation: number = 1;

  ngOnInit(): void {
    this.yearNumStr = this.calendar.getYearNumberStr(this.year);
    this.fillMonthGridData();
    this.updateExtraMargins(3);
  }

  ngOnChanges(): void {
    this.yearNumStr = this.calendar.getYearNumberStr(this.year);
    this.triggerAnimation();
    this.fillMonthGridData();
    this.updateExtraMargins(2);
    this.updateExtraMargins(3);
  }

  triggerAnimation(): void {
    this.animation = (this.animation == 1 ? 2 : 1); 
  }

  fillMonthGridData(): void {
    this.mGridData = [];
    this.months.forEach(m => {
      this.mGridData.push(this.calendar.getMonthGridData(this.year, m));
    });
  }

  shiftYear(incr: number): void {
    this.changeYear.emit(this.year + incr);
  }

  updateMonthState(layout: number, m: number, state: boolean): void {
    if (layout == 1) this.monthState.collapsed1Col[m] = state;
    if (layout == 2) this.monthState.collapsed2Col[m] = state;
    if (layout == 3) this.monthState.collapsed3Col[m] = state;
    this.updateExtraMargins(layout);
  }

  updateExtraMargins(layout: number): void {

    if (layout == 1) return;

    if (layout == 2) {
      this.monthState.extraMargin2Col.forEach((margin, m) => {
        if (m && m % 2) {
          let c1: boolean = this.monthState.collapsed2Col[m - 1];
          let c2: boolean = this.monthState.collapsed2Col[m];
          if (!c1 && !c2 && this.onSameLevel(2, m - 1, m)) {
            let w1: number = this.mGridData[m - 1].weekLines;
            let w2: number = this.mGridData[m].weekLines;
            this.monthState.extraMargin2Col[m - 1] = w1 < w2;
            this.monthState.extraMargin2Col[m] = w2 < w1;
          }
          else {
            this.monthState.extraMargin2Col[m - 1] = false;
            this.monthState.extraMargin2Col[m] = false;
          }
        }
      });
    }

    if (layout == 3) {
      this.monthState.extraMargin3Col.forEach((margin, m) => {
        if (m % 3 == 2) {
          let c1: boolean = this.monthState.collapsed3Col[m - 2];
          let c2: boolean = this.monthState.collapsed3Col[m - 1];
          let c3: boolean = this.monthState.collapsed3Col[m];
          if ((!c1 && !c2) || (!c1 && !c3) || (!c2 && !c3)) {
            let w1: number = this.mGridData[m - 2].weekLines;
            let w2: number = this.mGridData[m - 1].weekLines;
            let w3: number = this.mGridData[m].weekLines;
            this.monthState.extraMargin3Col[m - 2] = 
              !c1 && (
                (!c2 && w1 < w2 && this.onSameLevel(3, m - 2, m - 1)) || 
                (!c3 && w1 < w3 && this.onSameLevel(3, m - 2, m))
              );
            this.monthState.extraMargin3Col[m - 1] = 
              !c2 && (
                (!c1 && w2 < w1 && this.onSameLevel(3, m - 1, m - 2)) || 
                (!c3 && w2 < w3 && this.onSameLevel(3, m - 1, m))
              );
            this.monthState.extraMargin3Col[m] = 
              !c3 && (
                (!c1 && w3 < w1 && this.onSameLevel(3, m, m - 2)) || 
                (!c2 && w3 < w2 && this.onSameLevel(3, m, m - 1))
              );
          }
          else {
            this.monthState.extraMargin3Col[m - 2] = false;
            this.monthState.extraMargin3Col[m - 1] = false;
            this.monthState.extraMargin3Col[m] = false;
          }
        }
      });
    }
  }

  onSameLevel(layout: number, m1: number, m2: number): boolean {

    let level1: number = 0, level2: number = 0;
    let arrayC: boolean[] = 
      layout == 2 ? this.monthState.collapsed2Col :
        layout == 3 ? this.monthState.collapsed3Col : []
    let arrayM: boolean[] = 
      layout == 2 ? this.monthState.extraMargin2Col :
        layout == 3 ? this.monthState.extraMargin3Col : []

    arrayC.forEach((c, m) => {

      let mHeight: number = 
        this.mGridData[m].weekLines + (arrayM[m] ? 1 : 0);

      if (m < m1 && m % layout == m1 % layout) 
        level1 += c ? 1 : mHeight;
      if (m < m2 && m % layout == m2 % layout) 
        level2 += c ? 1 : mHeight;
    })

    return level1 == level2;
  }

}
