export interface Datum {
  x?: string | number | Date | null;
  y?: string | number | Date | null;
  [key: string]: any;
}

export interface Serie {
  id: string | number;
  data: Datum[];
  [key: string]: any;
}

export interface VolumetryGraphProps {
  data: Serie[];
  xScale?: 'hour' | 'day';
  onClick?: (datum: Datum) => unknown;
}
