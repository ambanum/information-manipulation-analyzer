import { GetVolumetry } from 'modules/Common/interfaces';

export interface Datum {
  x?: string | number | Date | null;
  y?: string | number | Date | null;
  [key: string]: any;
}

type XScale = 'hour' | 'day';
export interface VolumetryGraphProps {
  data: GetVolumetry[];
  xScale?: XScale;
  onFilterDateChange: (data: {
    min: Number;
    max: Number;
    dataMin: Number;
    dataMax: Number;
    type: string;
  }) => unknown;
  min: number;
  max: number;
  onClick?: (xScale: XScale, datum: Datum) => unknown;
}
