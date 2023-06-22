import { Injectable } from '@angular/core';

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

  constructDate(month: number, year: number): Date {

    //  JS has issues interpreting double-digit and single-digit years.
    //  Dates with such years (0 to 99) must be constructed via a string.
    //  The year 0 represents 1 BC, the year -1 is 2 BC, etc.

    let d: Date;

    if (year < 0 || year > 99) {
      d = new Date(year, month);
    }
    else {

      let strYear: string = '';
      let strMonth: string = '';

      if (year < 10) strYear = '000';
      else strYear = '00';

      if (month + 1 < 10) strMonth = '0';

      strYear += year.toString();
      strMonth += (month + 1).toString();

      d = new Date(strYear + '-' + strMonth + '-01');
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
}
