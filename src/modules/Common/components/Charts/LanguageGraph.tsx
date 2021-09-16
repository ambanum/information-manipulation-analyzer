import * as Highcharts from 'highcharts';
import * as React from 'react';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { LanguageGraphProps } from './LanguageGraph.d';
import { paletteColors } from './config';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const LanguageGraph = (props: LanguageGraphProps & HighchartsReact.Props) => {
  // more performant with arrays of number
  // and sort to prevent colors to be the same for big values
  const seriesData = props.data
    .map((d: any) => [d.id, d.label, d.value])
    .sort((a, b) => b[2] - a[2]);

  const data: Highcharts.Options = {
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
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        point: {
          events: {
            click: function () {
              props.onSliceClick(this.options);
            },
          },
        },
      },
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
      <div>
        <h4 className="fr-mb-1v">Most used languages</h4>
        <p className="fr-mb-0">View on pie chart.</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <HighchartsReact highcharts={Highcharts} options={data} {...props} />
      </div>
    </>
  );
};

export default React.memo(LanguageGraph);
