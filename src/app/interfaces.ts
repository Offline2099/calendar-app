
export interface Century {
  id: number;
  name: string;
  years: number[][];
  picked: boolean;
}

export interface Millennium {
  id: number;
  name: string;
  centuries: Century[];
  picked: boolean;
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