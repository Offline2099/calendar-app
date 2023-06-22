import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostBinding } from '@angular/core';
import { Millennium, Century } from '../interfaces';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.css']
})
export class YearPickerComponent implements OnInit, OnChanges {

  constructor(private calendar: CalendarService) { }

  @Input() minimize: boolean = true;
  @Input() year: number = new Date().getFullYear();
  @Output() pick: EventEmitter<number> = new EventEmitter();

  @HostBinding('class.minimized') minimized: boolean = true;

  pickedMillennium: Millennium = {id: 0, name: '', centuries: [], picked: false};
  pickedCentury: Century = {id: 0, name: '', years: [], picked: false};
  pickedYear: number = 0;

  centuryPicked: boolean = false;
  yearPicked: boolean = false;

  time: Millennium[][] = [];

  limits = {
    minMillennium: 
      this.calendar.getMillenniumFromYear(this.calendar.limits.minYear),
    maxMillennium: 
      this.calendar.getMillenniumFromYear(this.calendar.limits.maxYear),
    minCentury: 
      this.calendar.getCenturyFromYear(this.calendar.limits.minYear),
    maxCentury: 
      this.calendar.getCenturyFromYear(this.calendar.limits.maxYear),
    minYear: this.calendar.limits.minYear,
    maxYear: this.calendar.limits.maxYear
  }

  ngOnInit(): void {
    this.generateTimeStructure();
    this.pickYear(this.year);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minimize']) 
      if (!changes['minimize'].firstChange) 
        this.togglePicker();
    if (changes['year']) 
      this.pickYear(this.year);
  }

  generateTimeStructure(): void {

    this.time[0] = []; // BC
    this.time[1] = []; // AD

    for(let i = this.limits.minMillennium; i < 0; i++) {
      this.time[0].push({
        id: i,
        name: this.millenniumNameById(i),
        centuries: this.generateArrayOfCenturies(-i - 1, 'BC'),
        picked: false
      });
    }
    for(let i = 1; i <= this.limits.maxMillennium; i++) {
      this.time[1].push({
        id: i,
        name: this.millenniumNameById(i),
        centuries: this.generateArrayOfCenturies(i - 1, 'AD'),
        picked: false
      });
    }
  }

  generateArrayOfCenturies(m: number, era: string): Century[] {

    let array: Century[] = [];
    
    if (era == 'BC') {
      for(let i = 9; i >= 0; i--) {
        array.push(this.generateCentury(10 * m + i, era));
      }
    }
    if (era == 'AD') {
      for(let i = 0; i < 10; i++) {
        array.push(this.generateCentury(10 * m + i, era));
      }
    }

    return array;
  }

  generateCentury(n: number, era: string): Century {

    let c: Century = {
      id: era == 'BC' ? - n - 1 : n + 1,
      name: this.centuryNameById(era == 'AD' ? n + 1 : - n - 1),
      years: [],
      picked: false
    }
    
    if (era == 'BC') {
      for(let decade = -9; decade <= 0; decade++) {
        c.years[decade + 9] = [];
        for(let y = -9; y <= 0; y++) {
          c.years[decade + 9].push(-100 * n + 10 * decade + y);
        }
      }
    }
    if (era == 'AD') {
      for(let decade = 0; decade < 10; decade++) {
        c.years[decade] = [];
        for(let y = 0; y < 10; y++) {
          c.years[decade].push(100 * n + 10 * decade + y);
        }
      }
    }
    
    return c;
  }

  millenniumNameById(id: number): string {
    return this.addSuffix(id) + (id < 0 ? ' BC' : '')
  }

  centuryNameById(id: number): string {
    return this.addSuffix(id) + (id < 0 ? ' BC' : '')
  }

  addSuffix(n: number): string {

    let suffix: string = '';

    let nstr: string = n > 0 ? n.toString() : (-n).toString();
    let lastChar: string = nstr.charAt(nstr.length - 1);
    let secondLastChar: string = nstr.charAt(nstr.length - 2);

    if (lastChar === '1' && secondLastChar !== '1') 
      suffix = 'st';
    else if (lastChar === '2' && secondLastChar !== '1') 
      suffix = 'nd';
    else if (lastChar === '3' && secondLastChar !== '1') 
      suffix = 'rd';
    else suffix = 'th';

    return nstr + suffix;
  }

  pickMillennium(id: number): void {
    
    this.time.forEach(era => {
      era.forEach(m => {
        m.picked = (m.id === id);
        if (!m.picked) 
          m.centuries.forEach(c => c.picked = false);
      });
    });

    this.pickedMillennium.id = id;
    this.pickedMillennium.name = this.millenniumNameById(id);
    this.centuryPicked = false;
    this.yearPicked = false;
  }

  pickCentury(id: number): void {
    
    this.time.forEach(era => {
      era.forEach(m => {
        m.centuries.forEach(c => c.picked = (c.id === id));
      });
    });

    this.pickMillennium(this.calendar.getMillenniumFromCentury(id));

    this.pickedCentury.id = id;
    this.pickedCentury.name = this.centuryNameById(id);
    this.centuryPicked = true;
    this.yearPicked = id == this.calendar.getCenturyFromYear(this.pickedYear);
  }

  pickYear(y: number): void {
    this.pickedYear = y;
    this.pickCentury(this.calendar.getCenturyFromYear(y));
    this.yearPicked = true;
    if (this.year != y) this.pick.emit(y);
  }

  changeMillennium(incr: number): void {
    let current: number = this.pickedMillennium.id;
    let target: number = current + incr;
    if (!target) target += incr;
    this.pickMillennium(target);
  }

  changeCentury(incr: number): void {
    let current: number = this.pickedCentury.id;
    let target: number = current + incr;
    if (!target) target += incr;
    this.pickCentury(target);
  }

  changeYear(incr: number): void {
    this.pickYear(this.pickedYear + incr);
  }

  togglePicker(): void {
    this.minimized = !this.minimized;
    if (this.minimized && (!this.yearPicked || !this.centuryPicked))
      this.pickYear(this.year);
  }

}
