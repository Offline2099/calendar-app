import { Injectable } from '@angular/core';
import { DateDifference, MonthGridData } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  names = {
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  }

  limits = {
    minYear: -4998, 
    maxYear: 4999
  }

  getMonthName(n: number): string {
    let months: string[] = this.names.months;
    return months[n];
  }

  getMonthNumberString(m: number): string {
    return (m < 9 ? '0' : '') + (m + 1);
  }

  getYearNumberString(y: number): string {
    return y <= 0 ? -(y - 1) + ' BC' : y.toString();
  }

  constructDate(year: number, month: number, dayPassed?: number): Date {

    //  JS has issues interpreting double-digit and single-digit years.
    //  Dates with such years (0 to 99) must be constructed via a string.
    //  The year 0 represents 1 BC, the year -1 is 2 BC, etc.

    let d: Date;
    let day: number = dayPassed || 1;

    if (year < 0 || year > 99) {
      d = new Date(year, month, day);
    }
    else {

      let strYear: string = '';
      let strMonth: string = '';
      let strDay: string = '';

      if (year < 10) strYear = '000';
      else strYear = '00';

      if (month + 1 < 10) strMonth = '0';
      if (day < 10) strDay = '0';

      strYear += year.toString();
      strMonth += (month + 1).toString();
      strDay += day.toString();

      d = new Date(strYear + '-' + strMonth + '-' + strDay);
    }

    return d;
  }

  getCenturyFromYear(year: number): number {
    return year > 0 ? Math.ceil((year + 1) / 100) : Math.floor((year - 2) / 100);
  }

  getMillenniumFromYear(year: number): number {
    return year > 0 ? Math.ceil((year + 1) / 1000) : Math.floor((year - 2) / 1000);
  }

  getMillenniumFromCentury(century: number) {
    return century > 0 ? Math.ceil(century / 10) : Math.floor(century / 10);
  }

  getDifference(date1: Date, date2: Date): DateDifference {
    let diff: number = this.getDifferenceInMs(date1, date2);
    let msPerDay: number = 1000 * 60 * 60 * 24;
    let msPerWeek: number = msPerDay * 7;
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

  getDifferenceInDays(date1: Date, date2: Date): number {
    let diff: number = this.getDifferenceInMs(date1, date2);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getDifferenceInWeeks(date1: Date, date2: Date): number {
    let diff: number = this.getDifferenceInMs(date1, date2);
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
    
    let yDiff: number = y2 - y1;
    let diff = yDiff * 12 + m2 - m1;

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
        this.formatLongNumberStr(Math.abs(diff.d)),
        this.constructDiffStr(diff.d, ' day')
      ],
      wStr: [
        this.formatLongNumberStr(Math.abs(diff.w)),
        this.constructDiffStr(diff.w, ' week')
      ],
      mStr: [
        this.formatLongNumberStr(Math.abs(diff.m)),
        this.constructDiffStr(diff.m, ' month')
      ],
      yStr: [
        this.formatLongNumberStr(Math.abs(diff.y)),
        this.constructDiffStr(diff.y, ' year')
      ]
    };
  }

  constructDiffStr(n: number, str: string): string {
    if (!n) return '';
    return (Math.abs(n) == 1 ? str : str + 's') + 
        (n > 0 ? ' ago' : ' in the future');
  }

  formatLongNumberStr(n: number): string {

    let newStr: string = '';
    let str: string = n.toString();
    let length: number = str.length - 1;

    for(let i = length; i >= 0; i--) {
      newStr += str[i];
      if (i && (i != length) && !((length - i + 1) % 3)) 
        newStr += '\u2009';
    }

    return newStr.split('').reverse().join('');
  }

  getMonthGridData(year: number, month: number): MonthGridData {

    let mStart: Date = this.constructDate(year, month);

    let daysBefore: number = (mStart.getDay() || 7) - 1;
    let daysInMonth: number = new Date(mStart.getFullYear(), month + 1, 0).getDate();

    return {
      daysBefore: daysBefore,
      daysInMonth: daysInMonth,
      daysAfter: 7 - ((daysBefore + daysInMonth) % 7 || 7),
      weekLines: Math.ceil((daysBefore + daysInMonth) / 7)
    }
  }
}
