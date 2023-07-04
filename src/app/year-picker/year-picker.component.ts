import { 
  Component, OnInit, HostBinding,
  Input, OnChanges, SimpleChanges, 
  Output, EventEmitter } from '@angular/core';

import { 
  CalendarLimits, 
  YearPickerSection, YearPickerButtonRow, YearPickerButton } from '../interfaces';

import { CalendarService } from '../calendar.service';
import { SettingsService } from '../settings.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.css']
})
export class YearPickerComponent implements OnInit, OnChanges {

  constructor(
    private calendar: CalendarService,
    private settings: SettingsService,
    private utility: UtilityService) { }

  @Input() minimize: boolean = true;
  @Input() year: number = 0;

  @HostBinding('class.minimized') minimized: boolean = true;

  @Output() pick: EventEmitter<number> = new EventEmitter();

  sections: YearPickerSection[] = [];
  limits: CalendarLimits = this.settings.getCalendarLimits();

  pickedM: number = 0;
  pickedC: number = 0;
  pickedY: number = 0;

  settingsPanel: boolean = false;
  settingsPanelBlocks!: {text: string, buttons: string[]}[];

  ngOnInit(): void {
    this.pickY(this.year);
    this.constructYearPickerSections();
    this.constructSettingsPanelBlocks();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['minimize']) 
      if (!changes['minimize'].firstChange) 
        this.togglePicker();

    if (changes['year'])
      if (!changes['year'].firstChange)
        this.pickY(this.year);
  }

  togglePicker(): void {

    this.minimized = !this.minimized;

    if (this.minimized && 
      (!this.pickedC || !this.pickedY || this.pickedY == 0.1)) {
      this.pickY(this.year);
      this.updateCenturies();
      this.updateYears();
    }
  }

  toggleSection(s: YearPickerSection): void {
    s.collapsed = !s.collapsed;
  }

  toggleRow(section: number, row: YearPickerButtonRow): void {
    if (section == 3)
      row.collapsed = !row.collapsed;
  }

  toggleSettings(): void {
    this.settingsPanel = !this.settingsPanel;
  }

  setCalendarLimits(start: number, end: number): void {
    this.settings.setExtendedLimits(start, end);
    this.limits = this.settings.getCalendarLimits();
    this.updateMillenniaVisibility();
  }

  constructYearPickerSections(): void {

    let sectionNames = [
      {normal: 'Millennia', minimized: 'Millennium'},
      {normal: 'Centuries', minimized: 'Century'},
      {normal: 'Years', minimized: 'Year'},
    ];

    sectionNames.forEach((s, i) => {
      this.sections.push({
        id: i + 1,
        name: s,
        collapsed: i != 2,
        rows: !i ? this.millenniaButtonRows() : []
      });
    })

    this.updateCenturies();
    this.updateYears();
  }

  millenniaButtonRows(): YearPickerButtonRow[] {

    let rows: YearPickerButtonRow[] = [];
    let mExt = this.limits.maxExt + 1;

    for(let i = -mExt; i <= mExt; i++) {
      if (!i) continue;
      rows.push({
        name: '',
        displayed: i + 1 >= -this.limits.startExt && i - 1 <= this.limits.endExt,
        collapsed: false,
        buttons: this.millenniaButtons(i)
      })
    }

    return rows;
  }

  constructSettingsPanelBlocks(): void {

    let mExt = this.limits.maxExt + 1;

    this.settingsPanelBlocks = [
      {text: 'Earliest Millennium in Range:', buttons: []},
      {text: 'Last Millennium in Range:', buttons: []}
    ];

    for(let i = -mExt; i <= mExt; i++) {
      if (!i) continue;
      this.settingsPanelBlocks[i > 0 ? 1 : 0].buttons.push(this.millenniumNameById(5 * i, false));
    }
  }

  millenniaButtons(row: number): YearPickerButton[] {

    let buttons: YearPickerButton[] = [];
    let start: number = 5 * (row > 0 ? row - 1 : row) + 1;
    let end: number = (row > 0 ? 5 * row : 5 * (row + 1));

    for(let i = start; i <= end; i++) {
      buttons.push({
        id: row > 0 ? i : i - 1,
        text: this.millenniumNameById(row > 0 ? i : i - 1, false)
      });
    }

    return buttons;
  }

  centuryButtonRows(millennium: number): YearPickerButtonRow[] {
    return [{
      name: this.millenniumNameById(millennium, true),
      displayed: true,
      collapsed: false,
      buttons: this.centuryButtons(millennium)
    }]
  }

  centuryButtons(millennium: number): YearPickerButton[] {

    let buttons: YearPickerButton[] = [];
    let mil: number = Math.abs(millennium);

    for(let i = 10 * (mil - 1) + 1; i <= 10 * mil; i++) {
      buttons.push({
        id: millennium > 0 ? i : -i,
        text: this.centuryNameById(millennium > 0 ? i : -i, false)
      });
    }

    return (millennium > 0 ? buttons : buttons.reverse());
  }

  yearButtonRows(century: number): YearPickerButtonRow[] {

    let rows: YearPickerButtonRow[] = [];

    for(let decade = 0; decade < 10; decade++) {
      rows.push({
        name: this.decadeName(century, decade),
        displayed: true,
        collapsed: !this.decadeContainsYear(century, decade, this.pickedY),
        buttons: this.yearButtons(century, decade)
      });
    }
    
    return (century > 0 ? rows : rows.reverse());
  }

  yearButtons(century: number, decade: number): YearPickerButton[] {

    let buttons: YearPickerButton[] = [];

    let c: number = Math.abs(century);
    let start: number = 100 * (c - 1) + 10 * decade;
    let end: number = start + 10;

    for(let i = start; i < end; i++) {
      buttons.push({
        id: century > 0 ? i : -i,
        text: century > 0 ? i.toString() : i + ' BC'
      });
    }

    return (century > 0 ? buttons : buttons.reverse());
  }

  millenniumNameById(id: number, wordy: boolean): string {
    if (!id) return '';
    return this.utility.addNumberSuffix(id) + 
      (wordy ? ' Millennium' : '') + (id < 0 ? ' BC' : ' AD');
  }

  centuryNameById(id: number, wordy: boolean): string {
    if (!id) return '';
    return this.utility.addNumberSuffix(id) + 
      (wordy ? ' Century' : '') + (id < 0 ? ' BC' : wordy ? ' AD' : '');
  }

  decadeName(century: number, decade: number): string {
    return century > 0 ?
      (100 * (century - 1) + 10 * decade) + 's' :
      (-100 * (century + 1) + 10 * decade) + 's BC';
  }

  decadeContainsYear(century: number, decade: number, y: number): boolean {

    let start: number = century > 0 ?
      100 * (century - 1) + 10 * decade :
      100 * (century + 1) - 10 * (decade +1) + 2;
    let end: number = start + 10;

    return y >= start && y < end;
  }

  updateMillenniaVisibility(): void {
    let s: YearPickerSection | undefined = 
      this.sections.find(s => s.id == 1);
    if (s) {
      let mExt = this.limits.maxExt + 1;
      s.rows.forEach((row, i) => {
        row.displayed = 
          (i < mExt && mExt - i - 2 < this.limits.startExt) ||
          (i >= mExt && i - mExt - 1 < this.limits.endExt)
      })
    }
  }

  updateCenturies(): void {
    let s: YearPickerSection | undefined = 
      this.sections.find(s => s.id == 2);
    if (s) {
      s.collapsed = false;
      s.name.hintText = this.millenniumNameById(this.pickedM, true);
      s.rows = this.centuryButtonRows(this.pickedM);
    }
  }

  updateYears(): void {
    let s: YearPickerSection | undefined = 
      this.sections.find(s => s.id == 3);
    if (s) {
      s.collapsed = false;
      s.name.hintText = this.centuryNameById(this.pickedC, true);
      s.rows = this.yearButtonRows(this.pickedC);
    }
  }

  pickPeriod(section: number, id: number): void {

    if (this.minimized) {
      this.togglePicker();
      return;
    }
    
    if (section == 1) this.pickM(id);
    if (section == 2) this.pickC(id);
    if (section == 3) this.pickY(id);
  }

  pickPeriodAndTogglePicker(section: number, id: number): void {
    this.pickPeriod(section, id);
    if (section == 3) this.togglePicker();
  }

  shiftPeriod(section: number, incr: number) {

    if (section == 1) 
      this.pickM(this.utility.skipZero(this.pickedM, incr));

    if (section == 2) 
      this.pickC(this.utility.skipZero(this.pickedC, incr));

    if (section == 3) this.pickY(this.pickedY + incr);
  }

  pickM(id: number): void {

    this.pickedM = id;

    let millennium = this.calendar.getMillenniumFromYear(this.year);
    let century = this.calendar.getCenturyFromYear(this.year);
    let m = this.calendar.getMillenniumFromCentury(this.pickedC);

    this.pickedC = 
      (m == this.pickedM ?
        this.pickedC : (millennium == this.pickedM ? century : 0));

    if (this.pickedC && this.pickedY == 0.1) this.pickedY = this.year;

    this.updateCenturies();
    if (this.pickedC) this.updateYears();
  }

  pickC(id: number): void {

    this.pickedC = id;

    let m = this.calendar.getMillenniumFromCentury(this.pickedC);
    if (m != this.pickedM) this.pickM(m);

    let century = this.calendar.getCenturyFromYear(this.year);
    this.pickedY = (century == this.pickedC ? this.year : 0.1);

    this.updateYears();
  }

  pickY(id: number): void {

    this.pickedY = id;

    let c = this.calendar.getCenturyFromYear(this.pickedY);
    let m = this.calendar.getMillenniumFromYear(this.pickedY);

    if (c != this.pickedC) this.pickC(c);
    if (m != this.pickedM) this.pickM(m);

    if (id != this.year) this.pick.emit(id);
  }
}
