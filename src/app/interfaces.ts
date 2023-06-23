
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
  y: number;
  yStr?: string[];
}
