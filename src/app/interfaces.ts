
export interface CalendarLimits {
  minY: number;  maxY: number;
  minC: number;  maxC: number;
  minM: number;  maxM: number;
  startExt: number; endExt: number;
  maxExt: number;
}

export interface DateDifference {
  d: number;
  dStr?: {num: string; tail: string};
  w: number;
  wStr?: {num: string; tail: string};
  m: number;
  mStr?: {num: string; tail: string};
  y: number;
  yStr?: {num: string; tail: string};
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
  name: {
    normal: string;
    minimized: string;
    hintText?: string;
  },

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
  bg: {h: number, s: number, l: number};
}
