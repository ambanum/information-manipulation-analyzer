import * as Highcharts from 'highcharts';
import * as React from 'react';

import { BarGraphProps } from './BarGraph.d';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { paletteColors } from './config';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const BotProbabilityGraph = ({
  title,
  subtitle,
  yAxisTitle,
  data,
  ...props
}: BarGraphProps & HighchartsReact.Props) => {
  const options: Highcharts.Options = {
    title: {
      text: '',
    },
    chart: {
      type: 'column',
    },
    colors: paletteColors,
    yAxis: {
      title: {
        text: yAxisTitle,
      },
    },
    series: [
      {
        name: title,
        type: 'column',
        data,
      },
    ],
    ...props,
  };

  return (
    <>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">{title}</h4>
        <p className="fr-mb-0">{subtitle}</p>
      </div>
      <div className="fr-mt-4w">
        <HighchartsReact highcharts={Highcharts} options={options} {...props} />
      </div>
    </>
  );
};

export default React.memo(BotProbabilityGraph);
