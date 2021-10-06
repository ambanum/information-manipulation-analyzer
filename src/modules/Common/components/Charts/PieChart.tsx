import * as Highcharts from 'highcharts';
import * as React from 'react';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { PieChartProps } from './PieChart.d';
import { paletteColors } from './config';
import { useWindowSize } from 'react-use';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const PieChart = ({ title, subTitle, data, props }: PieChartProps & HighchartsReact.Props) => {
  // more performant with arrays of number
  // and sort to prevent colors to be the same for big values
  const seriesData = data.map((d: any) => [d.id, d.label, d.value]).sort((a, b) => b[2] - a[2]);
  const { width } = useWindowSize();

  const chartOptions: Highcharts.Options = {
    title: {
      text: '',
    },
    chart: {
      plotShadow: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat: '{point.id}: <b>{point.y}</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    colors: paletteColors,
    plotOptions: {
      pie: {
        allowPointSelect: true,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        showInLegend: width <= 560 ? true : false,
        center: ['50%', '50%'],
      },
    },
    legend: {
      itemDistance: 12,
      padding: 4,
    },
    series: [
      {
        type: 'pie',
        colorByPoint: true,
        data: seriesData,
        keys: ['id', 'name', 'y'],
      },
    ],
  };
  return (
    <>
      <div className="fr-mb-2w">
        {title && <h4 className="fr-mb-1v">{title}</h4>}
        {subTitle && <p className="fr-mb-0">{subTitle}</p>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} {...props} />
      </div>
    </>
  );
};

export default React.memo(PieChart);
