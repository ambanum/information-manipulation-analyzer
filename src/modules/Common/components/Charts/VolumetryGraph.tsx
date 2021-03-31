import * as Highcharts from 'highcharts';
import * as React from 'react';

import { useLocalStorage, usePrevious } from 'react-use';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { VolumetryGraphProps } from './VolumetryGraph.d';
import dayjs from 'dayjs';
import { paletteColors } from './config';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}
export type GraphType = 'day' | 'hour';

export interface InitialSerie {
  id: string;
  name: any;
  type: 'line';
  data: [number, number][];
}

const VolumetryGraph = ({
  onPointClick,
  data,
  type = 'hour',
  ...props
}: VolumetryGraphProps & HighchartsReact.Props) => {
  const [chartXTypeDisplay, setChartXTypeDisplay] = useLocalStorage<GraphType>(
    'ima-volumetry-graph-type',
    type
  );
  const initialSeries: InitialSerie[] = data.map((d) => ({
    id: d.id as string,
    name: d.id,
    type: 'line',
    data: d.data.map(({ x, y }: any) => [new Date(x).getTime(), y]),
  }));
  const previousXType = usePrevious(chartXTypeDisplay);
  const [options, setOptions] = React.useState<Highcharts.Options>({
    title: {
      text: '',
    },
    colors: paletteColors,
    xAxis: {
      type: 'datetime',
    },
    chart: {
      zoomType: 'x',
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              onPointClick({ data: data[this.series.index].data[this.index] });
            },
          },
        },
      },
    },
    series: initialSeries,
  });

  React.useEffect(() => {
    if (previousXType === chartXTypeDisplay || (!previousXType && chartXTypeDisplay === 'hour')) {
      return;
    }

    const newFormattedSeries: InitialSerie[] = [...initialSeries];

    newFormattedSeries.map((serie) => {
      if (chartXTypeDisplay === 'day') {
        const dayData: any = {};

        serie.data.forEach(([x, y]) => {
          const dayX: string = dayjs(x as any).format('YYYY-MM-DD');
          dayData[dayX] = (dayData[dayX] || 0) + (y as number);
        });
        serie.data = Object.keys(dayData).map((day) => [new Date(day).getTime(), dayData[day]]);
      }
      return serie;
    });

    setOptions({
      ...options,
      series: newFormattedSeries,
    });
  }, [chartXTypeDisplay, previousXType, setOptions, initialSeries]);

  return (
    <div>
      <div
        className="rf-btns-group rf-btns-group--sm rf-btns-group--inline rf-btns-group--right"
        style={{ paddingRight: '20px' }}
      >
        <button
          className={`rf-btn rf-btn--sm ${
            chartXTypeDisplay === 'hour' ? 'rf-fi-eye-line rf-btn--icon-left' : ''
          }`}
          onClick={() => setChartXTypeDisplay('hour')}
          disabled={chartXTypeDisplay === 'hour'}
          style={{ maxWidth: 'none' /* else text does not show in button */ }}
        >
          hour
        </button>
        <button
          className={`rf-btn rf-btn--sm ${
            chartXTypeDisplay === 'day' ? 'rf-fi-eye-line rf-btn--icon-left' : ''
          }`}
          onClick={() => setChartXTypeDisplay('day')}
          disabled={chartXTypeDisplay === 'day'}
          style={{ maxWidth: 'none' /* else text does not show in button */ }}
        >
          day
        </button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} {...props} />
    </div>
  );
};

export default React.memo(VolumetryGraph);
