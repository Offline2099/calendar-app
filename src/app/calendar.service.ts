import { Injectable } from '@angular/core';
import { DateDifference, MonthGridData } from './interfaces';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private utility: UtilityService) { }

  names = {
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    weekdays: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ]
  }

  getMonthName(n: number): string {
    let months: string[] = this.names.months;
    return months[n];
  }

  getMonthNumberStr(m: number): string {
    return (m < 9 ? '0' : '') + (m + 1);
  }

  getYearNumberStr(y: number): string {
    return y <= 0 ? -(y - 1) + ' BC' : y.toString();
  }

  getWeekdays(shift: number, short?: boolean): string[] {

    let weekdayNames: string[] = [];

    weekdayNames = Array.prototype.concat(
      this.names.weekdays.slice().splice(shift), 
      this.names.weekdays.slice().splice(0, shift)
    ); 

    if (short) 
      weekdayNames.forEach((el, i) => {
        weekdayNames[i] = weekdayNames[i].substring(0, 2);
      });

    return weekdayNames;
  }

  constructDate(year: number, month: number, dayPassed?: number): Date {

    //  JS has issues interpreting double-digit and single-digit years.
    //  Dates with such years (0 to 99) must be constructed via a string.

    let d: Date;
    let day: number = dayPassed || 1;

    if (year < 0 || year > 99) {
      d = new Date(year, month, day);
    }
    else {

      let strYear: string = (year < 10 ? '000' : '00') + year;
      let strMonth: string = this.getMonthNumberStr(month);
      let strDay: string = (day < 10 ? '0' : '') + day;

      d = new Date(strYear + '-' + strMonth + '-' + strDay);
    }

    return d;
  }

  getCenturyFromYear(y: number): number {
    return y > 0 ? Math.ceil((y + 1) / 100) : Math.floor((y - 2) / 100);
  }

  getMillenniumFromYear(y: number): number {
    return y > 0 ? Math.ceil((y + 1) / 1000) : Math.floor((y - 2) / 1000);
  }

  getMillenniumFromCentury(c: number) {
    return c > 0 ? Math.ceil(c / 10) : Math.floor(c / 10);
  }

  getDifference(date1: Date, date2: Date): DateDifference {

    let diff: number = this.getDifferenceInMs(date1, date2);
    const msPerDay: number = 1000 * 60 * 60 * 24;
    const msPerWeek: number = msPerDay * 7;

    return {
      d: Math.floor(diff / msPerDay),
      w: diff > 0 ? Math.floor(diff / msPerWeek) : Math.ceil(diff / msPerWeek),
      m: this.getDifferenceInMonths(date1, date2),
      y: this.getDifferenceInYears(date1, date2)
    };
  }

  getDifferenceInMs(d1: Date, d2: Date): number {
    return Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) - 
      Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  }

  getDifferenceInDays(d1: Date, d2: Date): number {
    return Math.floor(this.getDifferenceInMs(d1, d2) / (1000 * 60 * 60 * 24));
  }

  getDifferenceInWeeks(d1: Date, d2: Date): number {

    let diff: number = this.getDifferenceInMs(d1, d2);
    let msPerWeek: number = 1000 * 60 * 60 * 24 * 7;

    return diff > 0 ? Math.floor(diff / msPerWeek) : Math.ceil(diff / msPerWeek);
  }

  getDifferenceInMonths(date1: Date, date2: Date): number {

    if (date1 > date2) 
      return -this.getDifferenceInMonths(date2, date1);

    let y1: number = date1.getFullYear();
    let m1: number = date1.getMonth();
    let d1: number = date1.getDate();

    let y2: number = date2.getFullYear();
    let m2: number = date2.getMonth();
    let d2: number = date2.getDate();
    
    let diff = 12 * (y2 - y1) + m2 - m1;

    if (d1 > d2) diff--;

    return diff;
  }

  getDifferenceInYears(date1: Date, date2: Date): number {

    if (date1 > date2) 
      return -this.getDifferenceInYears(date2, date1);

    let y1: number = date1.getFullYear();
    let m1: number = date1.getMonth();
    let d1: number = date1.getDate();

    let y2: number = date2.getFullYear();
    let m2: number = date2.getMonth();
    let d2: number = date2.getDate();
    
    let diff: number = y2 - y1;

    if (m1 > m2) diff--;
    else {
        if (m1 == m2) {
            if (d1 > d2) diff--;
        }
    }

    return diff;
  }

  getDifferenceFromToday(date: Date): DateDifference {

    let diff: DateDifference = this.getDifference(date, new Date());

    return {
      d: diff.d,
      w: diff.w,
      m: diff.m,
      y: diff.y,
      dStr: [
        this.utility.formatLongNumberStr(Math.abs(diff.d)),
        this.constructTimeRelStr(diff.d, 'day')
      ],
      wStr: [
        this.utility.formatLongNumberStr(Math.abs(diff.w)),
        this.constructTimeRelStr(diff.w, 'week')
      ],
      mStr: [
        this.utility.formatLongNumberStr(Math.abs(diff.m)),
        this.constructTimeRelStr(diff.m, 'month')
      ],
      yStr: [
        this.utility.formatLongNumberStr(Math.abs(diff.y)),
        this.constructTimeRelStr(diff.y, 'year')
      ]
    };
  }

  constructTimeRelStr(diff: number, unit: string): string {
    if (!diff) return 'Current ' + unit;
    return (Math.abs(diff) == 1 ? ' ' + unit : ' ' + unit + 's') + 
      (diff > 0 ? ' ago' : ' in the future');
  }

  getMonthGridData(year: number, month: number, weekdayShift: number): MonthGridData {

    let mStart: Date = this.constructDate(year, month);

    let daysBefore: number = mStart.getDay() - weekdayShift;
    if (daysBefore < 0) daysBefore += 7;

    let daysInMonth: number = new Date(mStart.getFullYear(), month + 1, 0).getDate();

    return {
      daysBefore: daysBefore,
      daysInMonth: daysInMonth,
      daysAfter: 7 - ((daysBefore + daysInMonth) % 7 || 7),
      weekLines: Math.ceil((daysBefore + daysInMonth) / 7)
    }
  }
}
