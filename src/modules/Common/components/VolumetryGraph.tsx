import React from 'react';
import { ResponsiveLine, Serie, PointMouseHandler } from '@nivo/line';
import { LegendMouseHandler } from '@nivo/legends';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

export interface VolumetryGraphOptions {
  onClick?: PointMouseHandler;
}

export interface VolumetryGraphProps {
  data: Serie[];
  options: VolumetryGraphOptions;
}

const palette = {
  'blue-dark': '#484D7A',
  'orange-soft': '#FF6F4C',
  'yellow-dark': '#FDCF41',
  'green-dark': '#466964',
  'orange-dark': '#E18863',
  'pink-dark': '#D08A77',
  'blue-soft': '#5770BE',
  'green-soft': '#00AC8C',
  'pink-soft': '#FF8D7E',
  'green-light': '#91AE4F',
  'pink-light': '#FFC29E',
  'green-medium': '#169B62',
  'orange-medium': '#FF9940',
  'yellow-medium': '#FFE800',
  'green-warm': '#958B62',
  brown: '#A26859',
  purple: '#7D4E5B',
};
const paletteColors = Object.values(palette);

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
      curve="catmullRom"
      colors={paletteColors}
      margin={{ top: 50, right: 60, bottom: 220, left: 100 }}
      xScale={{ type: `time`, format: `%Y-%m-%dT%H:%M:%S.%L%Z`, precision: `hour` }}
      xFormat={(value: any) => dayjs(value).format('llll')}
      axisBottom={{
        format: (value: any) => dayjs(value).format('llll'),
        tickValues: 25,
        legend: '',
        legendOffset: 160 + 20,
        legendPosition: 'middle',
        tickRotation: -45,
      }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
      axisTop={null}
      axisRight={null}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
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

export default VolumetryGraph;
