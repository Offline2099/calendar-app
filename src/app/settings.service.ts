import { Injectable } from '@angular/core';
import { CalendarLimits } from './interfaces';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private calendar: CalendarService) { }

  minYear: number = -4998;
  maxYear: number = 4999;

  startExtended: number = 0;
  endExtended: number = 0;

  maxExt: number = 3;

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

}
