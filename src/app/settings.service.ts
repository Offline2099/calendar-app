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
  startExtended: number = 0;
  endExtended: number = 0;

  /*
    Sets the first day of the week relative to Sunday (default in JS).
    Can be a number between 0 and 6, otherwise won't work.
  */
  weekdayShift: number = 1;

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

  setWeekdayShift(shift: number) {
    if (shift >= 0 && shift <= 6)
      this.weekdayShift = shift;
  }

}
