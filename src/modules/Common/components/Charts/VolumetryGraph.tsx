import React from 'react';
import { ResponsiveLine, Serie, PointMouseHandler } from '@nivo/line';
import { LegendMouseHandler } from '@nivo/legends';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import { paletteColors } from './config';

export interface VolumetryGraphOptions {
  onClick?: PointMouseHandler;
}

export interface VolumetryGraphProps {
  data: Serie[];
  options: VolumetryGraphOptions;
}

const VolumetryGraph = ({ data, options = {} }: VolumetryGraphProps) => {
  const [formattedData, setFormattedData] = React.useState(data);

  const onLegendClick: LegendMouseHandler = ({ id: legendId }) => {
    const newFormattedData = [...formattedData];
    const index = formattedData.findIndex((f) => f.id === legendId);

    if (formattedData[index].data.length > 0) {
      newFormattedData[index].data = [];
    } else {
      newFormattedData[index].data = data[index].data;
    }
    // FIXME this seems to mutate the state, making initial data also changed
    setFormattedData(newFormattedData);
  };

  return (
    <ResponsiveLine
      data={formattedData}
      colors={paletteColors}
      curve="monotoneX"
      margin={{ top: 50, right: 60, bottom: 220, left: 100 }}
      xFormat={(value: any) => dayjs(value).format('llll')}
      xScale={{ type: `time`, format: `%Y-%m-%dT%H:%M:%S.%L%Z`, precision: `hour` }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (value: any) => dayjs(value).format('llll'),
        tickValues: 25,
        legend: '',
        legendOffset: 160 + 20,
        legendPosition: 'middle',
        tickRotation: -45,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      lineWidth={1}
      pointSize={8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          onClick: onLegendClick,
          translateY: 150,
          itemsSpacing: 10,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 8,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      {...options}
    />
  );
};

export default React.memo(VolumetryGraph);
