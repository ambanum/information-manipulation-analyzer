import * as Highcharts from 'highcharts';

export interface Point {
  id: string;
  label: string;
  value: number;
  percentage?: number;
}

export interface LanguageGraphProps {
  data: Point[];
  onSliceClick: (point: Highcharts.PointOptionsObject) => unknown;
}
