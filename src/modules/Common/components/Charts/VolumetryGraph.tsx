import * as Highcharts from 'highcharts';
import * as React from 'react';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { VolumetryGraphProps } from './VolumetryGraph.d';
import { paletteColors } from './config';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const VolumetryGraph = (props: VolumetryGraphProps & HighchartsReact.Props) => {
  const data: Highcharts.Options = {
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
              props.onPointClick({ data: props.data[this.series.index].data[this.index] });
            },
          },
        },
      },
    },
    series: props.data.map((d: any) => ({
      id: d.id,
      name: d.id,
      type: 'line',
      data: d.data.map(({ x, y }: any) => [new Date(x).getTime(), y]),
    })),
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={data} {...props} />
    </div>
  );
};

export default React.memo(VolumetryGraph);
