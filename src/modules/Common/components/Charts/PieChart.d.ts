import * as Highcharts from 'highcharts';

export interface Point {
  id: string;
  label: string;
  value: number;
  percentage?: number;
}

export interface PieChartProps {
	title?: string;
	subTitle?: string;
	data: Point[];
}
