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

if (typeof Highcharts === 'object') {
  Boost(Highcharts);
  HighchartsExporting(Highcharts);
}
export type GraphXScale = 'day' | 'hour';

const dataNotEqual = (first: [number, number][], second: [number, number][]) => {
  if (first.length !== second.length) {
    return true;
  }
  for (let i = 0; i < first.length; i++) {
    if (first[i][0] !== second[i][0] || first[i][1] !== second[i][1]) {
      return true;
    }
  }
  return false;
};

const addMissingPoints = (volumetryData: VolumetryGraphProps['data']) => {
  let extendedVolumetry: VolumetryGraphProps['data'] = [];
  let i = 0;
  const volumetryLength = volumetryData.length;

  volumetryData.forEach((volumetry) => {
    const volumetryHour = volumetry.hour;
    const volumetryDayJs = dayjs(volumetryHour);

    if (i > 0) {
      const volumetryPrevHour = volumetryDayJs.add(-1, 'hour').toDate();

      if (volumetryPrevHour.toISOString() !== dayjs(volumetryData[i - 1]?.hour).toISOString()) {
        extendedVolumetry.push({
          hour: volumetryPrevHour,
          nbTweets: 0,
          nbRetweets: 0,
          nbLikes: 0,
          nbQuotes: 0,
          nbReplies: 0,
        });
      }
    }

    extendedVolumetry.push({
      hour: volumetryHour,
      nbTweets: volumetry.nbTweets || 0,
      nbRetweets: volumetry.nbRetweets || 0,
      nbLikes: volumetry.nbLikes || 0,
      nbQuotes: volumetry.nbQuotes || 0,
      nbReplies: volumetry.nbReplies || 0,
    });

    if (i < volumetryLength - 1) {
      const volumetryNextHour = volumetryDayJs.add(1, 'hour').toDate();

      if (volumetryNextHour.toISOString() !== dayjs(volumetryData[i + 1]?.hour).toISOString()) {
        extendedVolumetry.push({
          hour: volumetryNextHour,
          nbTweets: 0,
          nbRetweets: 0,
          nbLikes: 0,
          nbQuotes: 0,
          nbReplies: 0,
        });
      }
    }
    i++;
  });

  return extendedVolumetry;
};

type VolumetrySeries = Highcharts.SeriesOptionsType & { data: [number, number][] };

const dataToSeries = (data: VolumetryGraphProps['data']) => {
  const series: VolumetrySeries[] = [
    { id: 'nbTweets', name: 'nbTweets', type: 'spline', showInLegend: true, data: [] },
    { id: 'nbRetweets', name: 'nbRetweets', type: 'spline', showInLegend: true, data: [] },
    { id: 'nbLikes', name: 'nbLikes', type: 'spline', showInLegend: true, data: [] },
    { id: 'nbQuotes', name: 'nbQuotes', type: 'spline', showInLegend: true, data: [] },
    { id: 'nbReplies', name: 'nbReplies', type: 'spline', showInLegend: true, data: [] },
  ];

  data.forEach(({ hour, nbTweets, nbRetweets, nbLikes, nbQuotes, nbReplies }) => {
    series[0].data.push([new Date(hour).getTime(), nbTweets]);
    series[1].data.push([new Date(hour).getTime(), nbRetweets]);
    series[2].data.push([new Date(hour).getTime(), nbLikes]);
    series[3].data.push([new Date(hour).getTime(), nbQuotes]);
    series[4].data.push([new Date(hour).getTime(), nbReplies]);
  });
  return series;
};

const timezoneDelayInMinutes: number = new Date().getTimezoneOffset();

const VolumetryGraph = ({
  onPointClick,
  data: rawData,
  xScale = 'hour',
  onFilterDateChange,
  min,
  max,
  ...props
}: VolumetryGraphProps & HighchartsReact.Props) => {
  const initialSeries = dataToSeries(addMissingPoints(rawData));

  const chartRef = React.useRef(null);
  const [recalculating, toggleRecalculating] = useToggle(false);
  const [chartXscaleDisplay, setChartXscaleDisplay] = useLocalStorage<GraphXScale>(
    'ima-volumetry-graph-x-scale',
    xScale
  );

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
            click: function ({ point }) {
              onPointClick(chartXscaleDisplay, {
                x: point.x,
                y: point.y,
              });
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
    dataNotEqual(options?.series[0]?.data || [], previousSeries[0].data);

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
    if (!min || !max) {
      // min and max have been reset by an external action
      const { chart } = chartRef?.current || ({} as any);

      chart && chart?.zoom();
    }
  }, [min, max]);

  React.useEffect(() => {
    if (
      (previousXscale === chartXscaleDisplay ||
        (!previousXscale && chartXscaleDisplay === 'hour')) &&
      !isNewData
    ) {
      return;
    }
    const newFormattedSeries: VolumetrySeries[] = [];

    initialSeries.forEach((serie) => {
      if (chartXscaleDisplay === 'day') {
        const dayData: any = {};

        serie.data.forEach(([x, y]: [number, number]) => {
          const dayX: string = dayjs(x as any).format('YYYY-MM-DD');
          dayData[dayX] = (dayData[dayX] || 0) + (y as number);
        });
        // @ts-ignore
        serie.data = Object.keys(dayData).map((day) => [new Date(day).getTime(), dayData[day]]);
      }
      newFormattedSeries.push(serie);
    });

    setOptions({
      ...options,
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
