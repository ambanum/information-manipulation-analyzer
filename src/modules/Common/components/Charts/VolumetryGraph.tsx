import { LegendMouseHandler } from '@nivo/legends';
import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { VolumetryGraphProps } from './VolumetryGraph.d';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { paletteColors } from './config';

dayjs.extend(localizedFormat);

const VolumetryGraph = ({ data, onClick, type = 'hour' }: VolumetryGraphProps) => {
  // console.log('re-render VolumetryGraph');
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

  const dateFormat = type === 'day' ? 'ddd ll' : 'llll';
  const dateInputFormat = type === 'day' ? `%Y-%m-%d` : `%Y-%m-%dT%H:%M:%S.%L%Z`;

  return (
    <ResponsiveLine
      data={formattedData}
      colors={paletteColors}
      curve="monotoneX"
      margin={{ top: 50, right: 60, bottom: 220, left: 100 }}
      xFormat={(value: any) => dayjs(value).format(dateFormat)}
      yFormat={(value: any) => value.toLocaleString('en')}
      xScale={{ type: `time`, format: dateInputFormat, precision: type }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (value: any) => dayjs(value).format(dateFormat),
        tickValues: 25,
        legend: '',
        legendOffset: 160 + 20,
        legendPosition: 'middle',
        tickRotation: -45,
      }}
      axisLeft={{
        format: (value: any) => value.toLocaleString('en'),
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
      onClick={onClick}
    />
  );
};

export default React.memo(VolumetryGraph);
