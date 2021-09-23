import * as Highcharts from 'highcharts/highstock';
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
  showInLegend: boolean;
  type: 'line' | 'spline';
  data: [number, number][];
}
const timezoneDelayInMinutes: number = new Date().getTimezoneOffset();

const VolumetryGraph = ({
  onPointClick,
  data,
  xScale = 'hour',
  onFilterDateChange,
  min,
  max,
  ...props
}: VolumetryGraphProps & HighchartsReact.Props) => {
  const chartRef = React.useRef(null);
  const [recalculating, toggleRecalculating] = useToggle(false);
  const [chartXscaleDisplay, setChartXscaleDisplay] = useLocalStorage<GraphXScale>(
    'ima-volumetry-graph-x-scale',
    xScale
  );

  const initialSeries: InitialSerie[] = data.map((d) => ({
    id: d.id as string,
    name: d.id,
    showInLegend: true,
    type: 'spline',
    data: d.data.map(({ x, y }: any) => [new Date(x).getTime(), y]),
  }));

  const previousXscale = usePrevious(chartXscaleDisplay);
  const previousSeries = usePrevious(initialSeries);

  const [options, setOptions] = React.useState<Highcharts.Options>({
    title: {
      text: '',
    },
    colors: paletteColors,
    chart: {
      zoomType: 'x',
      events: {
        load: function () {
          const chart = this;
          const xAxis = chart.xAxis[0];

          if (min && max) {
            const newStart = +min;
            const newEnd = +max;

            xAxis.setExtremes(newStart, newEnd);
          }
        },
      },
    },
    legend: {
      enabled: true,
    },
    time: {
      getTimezoneOffset: () => timezoneDelayInMinutes,
    },
    xAxis: {
      events: {
        afterSetExtremes: ({ min, max, dataMin, dataMax, type }) => {
          onFilterDateChange({
            min,
            max,
            dataMin,
            dataMax,
            type,
          });
        },
      },
    },
    tooltip: {
      valueDecimals: 0,
    },
    plotOptions: {
      spline: {
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              onPointClick(chartXscaleDisplay, { data: data[this.series.index].data[this.index] });
            },
          },
        },
      },
    },
    series: initialSeries,
  });

  const isNewData =
    previousSeries &&
    options.series &&
    previousXscale === chartXscaleDisplay &&
    // @ts-ignore
    (options?.series[0]?.data || []).length !== previousSeries[0].data.length;

  const changeXScale = React.useCallback(
    (newXScale: GraphXScale) => () => {
      toggleRecalculating(true);
      setChartXscaleDisplay(newXScale);
    },
    [setChartXscaleDisplay, toggleRecalculating]
  );

  React.useEffect(() => {
    if (isNewData) {
      const { chart } = chartRef?.current || ({} as any);

      chart && chart?.zoom();
    }
  }, [isNewData]);

  React.useEffect(() => {
    if (
      (previousXscale === chartXscaleDisplay ||
        (!previousXscale && chartXscaleDisplay === 'hour')) &&
      !isNewData
    ) {
      return;
    }
    const newFormattedSeries: InitialSerie[] = [];

    initialSeries.forEach((serie) => {
      if (chartXscaleDisplay === 'day') {
        const dayData: any = {};

        serie.data.forEach(([x, y]) => {
          const dayX: string = dayjs(x as any).format('YYYY-MM-DD');
          dayData[dayX] = (dayData[dayX] || 0) + (y as number);
        });
        serie.data = Object.keys(dayData).map((day) => [new Date(day).getTime(), dayData[day]]);
      }
      newFormattedSeries.push(serie);
    });

    setOptions({
      ...options,
      plotOptions: {
        ...options.plotOptions,
        spline: {
          ...options.plotOptions?.spline,
          point: {
            ...options.plotOptions?.spline?.point,
            events: {
              ...options.plotOptions?.spline?.point?.events,
              click: function () {
                onPointClick(chartXscaleDisplay, {
                  data: data[this.series.index].data[this.index],
                });
              },
            },
          },
        },
      },
      series: newFormattedSeries,
    });
    toggleRecalculating(false);
  }, [
    chartXscaleDisplay,
    previousXscale,
    setOptions,
    initialSeries,
    toggleRecalculating,
    isNewData,
  ]);

  return (
    <div className={styles.wrapper} style={{ opacity: recalculating ? 0.3 : 1 }}>
      <div
        className={`fr-btns-group fr-btns-group--sm fr-btns-group--inline fr-btns-group--right ${styles.buttonBar}`}
      >
        <button
          className={`fr-btn fr-btn--sm fr-btn--secondary ${
            chartXscaleDisplay === 'hour' ? 'fr-fi-eye-line fr-btn--icon-left' : ''
          }`}
          onClick={changeXScale('hour')}
          disabled={chartXscaleDisplay === 'hour'}
        >
          hour
        </button>
        <button
          className={`fr-btn fr-btn--sm fr-btn--secondary ${
            chartXscaleDisplay === 'day' ? 'fr-fi-eye-line fr-btn--icon-left' : ''
          }`}
          onClick={changeXScale('day')}
          disabled={chartXscaleDisplay === 'day'}
        >
          day
        </button>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        ref={chartRef}
        {...props}
      />
    </div>
  );
};

export default React.memo(VolumetryGraph);
