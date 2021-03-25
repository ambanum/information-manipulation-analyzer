import { MouseEventHandler } from '@nivo/pie';

export interface LanguageGraphProps {
  data: { label: string; value: number; id: string }[];
  onClick?: MouseEventHandler<any>;
}
