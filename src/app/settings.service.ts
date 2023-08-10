import { Injectable } from '@angular/core';
import { CalendarLimits } from './interfaces';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private calendar: CalendarService) { }

  private minYear: number = -4998;
  private maxYear: number = 4999;

  private maxExt: number = 3;

  /*
    Increasing these numbers by one extends the calendar limits by 5000 years
    in the corresponding direction. These numbers cannot exceed maxExt.
    Increasing maxExt manually would allow displaying the calendar up to the
    date limits of JS (about 271000 years in each direction), although it is
    useless in practice since the calendar becomes inaccurate there.
  */
  private startExtended: number = 0;
  private endExtended: number = 0;

  getCalendarLimits(): CalendarLimits {

    let minY: number = this.minYear - 5000 * this.startExtended;
    let maxY: number = this.maxYear + 5000 * this.endExtended;

    return {
      minY: minY,
      maxY: maxY,
      minC: this.calendar.getCenturyFromYear(minY),
      maxC: this.calendar.getCenturyFromYear(maxY),
      minM: this.calendar.getMillenniumFromYear(minY),
      maxM: this.calendar.getMillenniumFromYear(maxY),
      startExt: this.startExtended,
      endExt: this.endExtended,
      maxExt: this.maxExt
    }
  }

  setExtendedLimits(start: number, end: number): void {
    this.startExtended = start;
    this.endExtended = end;
  }


  /*
    Sets the first day of the week relative to Sunday (default in JS).
    Can be a number between 0 and 6, otherwise won't work.
  */
  weekdayShift: number = 1;

  setWeekdayShift(shift: number) {
    if (shift >= 0 && shift <= 6)
      this.weekdayShift = shift;
  }


  /*
    Color settings for button backgrounds.
    The colors are specified in HSL format, only hue is different.
  */

  private hueMillenniaBC: number[] = [
    40, 34, 26, 18, 10,
    0, -10, -20, -25, -30,
    -30, -32, -34, -36, -38,
    -41, -42, -43, -44, -45
  ];

  private hueMillenniaCE: number[] = [
    50, 70, 130, 160, 180,
    184, 188, 192, 196, 200,
    204, 208, 212, 216, 220,
    224, 228, 232, 236, 240
  ];

  private getSubIntervalColor(type: string, id: number): number {

    let mbc: number[] = this.hueMillenniaBC;
    let mce: number[] = this.hueMillenniaCE;

    let mc: number, mn: number;
    let cc: number, cn: number;
    let n: number = 1;

    if (type == 'century') mc = this.calendar.getMillenniumFromCentury(id);
    if (type == 'year') mc = this.calendar.getMillenniumFromYear(id);
    mn = id > 0 ? mc! + 1 : mc! - 1;

    cc = this.getMillenniumColor(mc!);
    cn = this.getMillenniumColor(mn);

    if (type == 'century') n = 10;
    if (type == 'year') n = 1000;
    
    return cc + (Math.abs(id) - n * (Math.abs(mc!) - 1)) * (cn - cc) / n;

  }

  getMillenniumColor(id: number): number {

    let mbc: number[] = this.hueMillenniaBC;
    let mce: number[] = this.hueMillenniaCE;

    if (id < 0) {
        if (id < -mbc.length) return mbc[mbc.length - 1];
        else return mbc[-id - 1];
      }

    if (id > 0) {
      if (id > mce.length) return mce[mce.length - 1];
      else return mce[id - 1];
    }

    return 120;
  }

  getCenturyColor(id: number): number {
    return this.getSubIntervalColor('century', id);
  }

  getYearColor(id: number): number {
    return this.getSubIntervalColor('year', id);
  }

}
