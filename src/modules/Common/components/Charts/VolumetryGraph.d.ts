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

type XScale = 'hour' | 'day';
export interface VolumetryGraphProps {
  data: Serie[];
  xScale?: XScale;
  onFilterDateChange: (data: { min: Number; max: Number }) => unknown;
  defaultValues: {
    min: number;
    max: number;
  };
  onClick?: (xScale: XScale, datum: Datum) => unknown;
}
