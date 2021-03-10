import { ResponsiveLine, Serie } from '@nivo/line';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

export interface VolumetryGraphProps {
  data: Serie[];
}
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const VolumetryGraph = ({ data }: VolumetryGraphProps) => (
  <ResponsiveLine
    data={data}
    curve="cardinal"
    margin={{ top: 50, right: 60, bottom: 220, left: 100 }}
    xScale={{ type: `time`, format: `%Y-%m-%dT%H:%M:%S.%L%Z`, precision: `hour` }}
    xFormat={(value: any) => dayjs(value).format('llll')}
    axisBottom={{
      format: (value: any) => dayjs(value).format('llll'),
      tickValues: 25,
      legend: '',
      legendOffset: 120 + 20,
      legendPosition: 'middle',
      tickRotation: -45,
    }}
    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
    yFormat=" >-.2f"
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
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: 'bottom',
        direction: 'column',
        justify: true,
        translateX: 0,
        translateY: 150,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
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
  />
);

export default VolumetryGraph;
