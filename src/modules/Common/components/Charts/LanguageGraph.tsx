import { MouseEventHandler, ResponsivePieCanvas } from '@nivo/pie';

import React from 'react';
import { paletteColors } from './config';
import styles from './Graph.module.scss';

export interface LanguageGraphProps {
  data: { label: string; value: number; id: string }[];
  onClick?: MouseEventHandler<any>;
}

const LanguageGraph = ({ data, onClick }: LanguageGraphProps) => {
  // console.log('re-render LanguageGraph');
  return (
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
      sliceLabel={(datum) => (datum.data.value || 0).toLocaleString('en')}
      tooltip={({ datum }) => (
        <div
          className={styles.tooltip}
          data-color={datum?.color}
          style={{ backgroundColor: datum?.color }}
        >
          <div>
            <strong>{datum.data.label}</strong>
          </div>
          <div>
            <em>{(datum.data.value || 0).toLocaleString('en')}</em>
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
      onClick={onClick}
    />
  );
};

export default React.memo(LanguageGraph);
