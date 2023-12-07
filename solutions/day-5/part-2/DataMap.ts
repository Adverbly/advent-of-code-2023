export interface Bound {
  destinationStart: number;
  sourceStart: number;
  size: number;
}

export interface DataMap {
  name: string;
  bounds: Bound[];
  from: string;
  to: string;
}

export type Maps = Record<string, DataMap>;
