import React from 'react';
import { ResponsivePieCanvas, MouseEventHandler } from '@nivo/pie';
import { paletteColors } from './config';

export interface LanguageGraphOptions {
  onClick?: MouseEventHandler<any>;
}

export interface LanguageGraphProps {
  data: any;
  options: LanguageGraphOptions;
}

const LanguageGraph = ({ data, options = {} }: LanguageGraphProps) => (
  <ResponsivePieCanvas
    data={data}
    colors={paletteColors}
    margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
    radialLabelsSkipAngle={10}
    radialLabel={(d) => `${d.label} (${d.value})`}
    radialLabelsTextColor="#333333"
    radialLabelsLinkColor={{ from: 'color' }}
    sliceLabelsSkipAngle={10}
    sliceLabelsTextColor="#333333"
    tooltip={({ datum }) => (
      <div
        style={{
          backgroundColor: datum?.color,
          border: '2px solid white',
          boxShadow: '0 0px 13px 8px #e1e1e1;',
          padding: '10px 20px',
          minWidth: '160px',
        }}
      >
        <div>
          <strong>{datum.data.label}</strong>
        </div>
        <div>
          <em>{datum.data.value}</em>
        </div>
        <div>
          <small>{datum.data.id}</small>
        </div>
      </div>
    )}
    legends={[
      {
        anchor: 'right',
        direction: 'column',
        justify: false,
        translateX: 140,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 60,
        itemHeight: 14,
        itemTextColor: '#999',
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: 14,
        symbolShape: 'circle',
      },
    ]}
    {...options}
  />
);

export default React.memo(LanguageGraph);
