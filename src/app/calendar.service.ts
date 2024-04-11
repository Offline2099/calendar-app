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

  dayNumberStr(day: number): string {
    return (day < 10 ? '0' : '') + day;
  }

  monthNumberStr(m: number): string {
    return (m < 9 ? '0' : '') + (m + 1);
  }

  monthName(m: number): string {
    return this.names.months[m];
  }

  yearNumberStr(y: number): string {
    return y > 0 ? y.toString() : -(y - 1) + ' BC';
  }

  decadeName(century: number, decade: number): string {
    return century > 0 ?
      (100 * (century - 1) + 10 * decade) + 's' :
      (-100 * (century + 1) + 10 * decade) + 's BC';
  }

  centuryName(id: number, wordy: boolean): string {
    return this.utility.addNumberSuffix(id > 0 ? id : -id) + 
      (wordy ? ' Century' : '') + (id < 0 ? ' BC' : wordy ? ' AD' : '');
  }

  millenniumName(id: number, wordy: boolean): string {
    return this.utility.addNumberSuffix(id > 0 ? id : -id) + 
      (wordy ? ' Millennium' : '') + (id < 0 ? ' BC' : ' AD');
  }

  weekdayNames(shift: number, short?: boolean): string[] {

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

  getCenturyFromYear(y: number): number {
    return y > 0 ? Math.ceil((y + 1) / 100) : Math.floor((y - 2) / 100);
  }

  getMillenniumFromYear(y: number): number {
    return y > 0 ? Math.ceil((y + 1) / 1000) : Math.floor((y - 2) / 1000);
  }

  getMillenniumFromCentury(c: number) {
    return c > 0 ? Math.ceil(c / 10) : Math.floor(c / 10);
  }

  decadeContainsYear(century: number, decade: number, y: number): boolean {

    let start: number = century > 0 ?
      100 * (century - 1) + 10 * decade :
      100 * (century + 1) - 10 * (decade +1) + 2;
    let end: number = start + 10;

    return y >= start && y < end;
  }

  constructDate(year: number, month: number, dayPassed?: number): Date {

    //  JS has issues interpreting double-digit and single-digit years.
    //  Dates with such years (0 to 99) must be constructed via a string.

    let day: number = dayPassed || 1;

    if (year < 0 || year > 99) {
      return new Date(year, month, day);
    }
    else {

      let strYear: string = (year < 10 ? '000' : '00') + year;
      let strMonth: string = this.monthNumberStr(month);
      let strDay: string = this.dayNumberStr(day);

      return new Date(`${strYear}-${strMonth}-${strDay}`);
    }
  }

  getDifference(date1: Date, date2: Date): DateDifference {

    const msPerDay: number = 1000 * 60 * 60 * 24;
    const msPerWeek: number = msPerDay * 7;

    let y1: number = date1.getFullYear();
    let m1: number = date1.getMonth();
    let d1: number = date1.getDate();

    let y2: number = date2.getFullYear();
    let m2: number = date2.getMonth();
    let d2: number = date2.getDate();

    let msDiff: number = Date.UTC(y2, m2, d2) - Date.UTC(y1, m1, d1);

    return {
      d: Math.floor(msDiff / msPerDay),
      w: msDiff > 0 ? Math.floor(msDiff / msPerWeek) : Math.ceil(msDiff / msPerWeek),
      m: date1 < date2 ? 
        this.getDifferenceInMonths(y1, m1, d1, y2, m2, d2) :
          -this.getDifferenceInMonths(y2, m2, d2, y1, m1, d1),
      y: date1 < date2 ? 
        this.getDifferenceInYears(y1, m1, d1, y2, m2, d2) :
          -this.getDifferenceInYears(y2, m2, d2, y1, m1, d1)
    };
  }

  getDifferenceInMonths(
    y1: number, m1: number, d1: number, 
    y2: number, m2: number, d2: number): number {
    
    let diff: number = 12 * (y2 - y1) + m2 - m1;
    if (d1 > d2) diff--;

    return diff;
  }

  getDifferenceInYears(
    y1: number, m1: number, d1: number, 
    y2: number, m2: number, d2: number): number {
    
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
      dStr: {
        num: this.utility.formatLongNumberStr(Math.abs(diff.d)),
        tail: this.constructTimeRelStr(diff.d, 'day')
      },
      wStr: {
        num: this.utility.formatLongNumberStr(Math.abs(diff.w)),
        tail: this.constructTimeRelStr(diff.w, 'week')
      },
      mStr: {
        num: this.utility.formatLongNumberStr(Math.abs(diff.m)),
        tail: this.constructTimeRelStr(diff.m, 'month')
      },
      yStr: {
        num: this.utility.formatLongNumberStr(Math.abs(diff.y)),
        tail: this.constructTimeRelStr(diff.y, 'year')
      }
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
