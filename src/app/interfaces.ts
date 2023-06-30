
export interface CalendarLimits {
  minY: number;  maxY: number;
  minC: number;  maxC: number;
  minM: number;  maxM: number;
  startExt: number; endExt: number;
  maxExt: number;
}

export interface DateDifference {
  d: number;
  dStr?: string[];
  w: number;
  wStr?: string[];
  m: number;
  mStr?: string[];
  y: number;
  yStr?: string[];
}

export interface MonthGridData {
  daysBefore: number;
  daysInMonth: number;
  daysAfter: number;
  weekLines: number;
}

export interface YearBlockState {
  collapsed1Col: boolean[];
  collapsed2Col: boolean[];
  collapsed3Col: boolean[];
  extraMargin2Col: boolean[];
  extraMargin3Col: boolean[];
}

export interface YearPickerSection {
  id: number;
  name: string;
  collapsed: boolean;
  rows: YearPickerButtonRow[];
}

export interface YearPickerButtonRow {
  name: string;
  displayed: boolean;
  collapsed: boolean;
  buttons: YearPickerButton[];
}

export interface YearPickerButton {
  id: number;
  text: string;
}
