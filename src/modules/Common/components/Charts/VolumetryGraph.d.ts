import { PointMouseHandler, Serie } from '@nivo/line';

export interface VolumetryGraphProps {
  data: Serie[];
  type?: 'hour' | 'day';
  onClick?: PointMouseHandler;
}
