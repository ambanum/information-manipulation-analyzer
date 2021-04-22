import * as Highcharts from 'highcharts';
import * as React from 'react';

import { useLocalStorage, usePrevious, useToggle } from 'react-use';

import Boost from 'highcharts/modules/boost';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { VolumetryGraphProps } from './VolumetryGraph.d';
import dayjs from 'dayjs';
import { paletteColors } from './config';
import styles from './Graph.module.scss';

Boost(Highcharts);

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}
export type GraphXScale = 'day' | 'hour';

export interface InitialSerie {
  id: string;
  name: any;
  type: 'line';
  data: [number, number][];
}
const timezoneDelayInMinutes: number = new Date().getTimezoneOffset();

const VolumetryGraph = ({
  onPointClick,
  data,
  xScale = 'hour',
  ...props
}: VolumetryGraphProps & HighchartsReact.Props) => {
  const [recalculating, toggleRecalculating] = useToggle(false);
  const [chartXscaleDisplay, setChartXscaleDisplay] = useLocalStorage<GraphXScale>(
    'ima-volumetry-graph-x-scale',
    xScale
  );
  const initialSeries: InitialSerie[] = data.map((d) => ({
    id: d.id as string,
    name: d.id,
    type: 'line',
    data: d.data.map(({ x, y }: any) => [new Date(x).getTime(), y]),
  }));
  const previousXscale = usePrevious(chartXscaleDisplay);
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
    time: {
      getTimezoneOffset: () => timezoneDelayInMinutes,
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

  const changeXScale = React.useCallback(
    (newXScale: GraphXScale) => () => {
      toggleRecalculating(true);
      setChartXscaleDisplay(newXScale);
    },
    [setChartXscaleDisplay, toggleRecalculating]
  );

  React.useEffect(() => {
    if (
      previousXscale === chartXscaleDisplay ||
      (!previousXscale && chartXscaleDisplay === 'hour')
    ) {
      return;
    }
    const newFormattedSeries: InitialSerie[] = [...initialSeries];

    newFormattedSeries.map((serie) => {
      if (chartXscaleDisplay === 'day') {
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
    toggleRecalculating(false);
  }, [chartXscaleDisplay, previousXscale, setOptions, initialSeries, toggleRecalculating]);

  return (
    <div className={styles.wrapper} style={{ opacity: recalculating ? 0.3 : 1 }}>
      <div
        className={`rf-btns-group rf-btns-group--sm rf-btns-group--inline rf-btns-group--right ${styles.buttonBar}`}
      >
        <button
          className={`rf-btn rf-btn--sm ${
            chartXscaleDisplay === 'hour' ? 'rf-fi-eye-line rf-btn--icon-left' : ''
          }`}
          onClick={changeXScale('hour')}
          disabled={chartXscaleDisplay === 'hour'}
        >
          hour
        </button>
        <button
          className={`rf-btn rf-btn--sm ${
            chartXscaleDisplay === 'day' ? 'rf-fi-eye-line rf-btn--icon-left' : ''
          }`}
          onClick={changeXScale('day')}
          disabled={chartXscaleDisplay === 'day'}
        >
          day
        </button>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} {...props} />
    </div>
  );
};

export default React.memo(VolumetryGraph);
