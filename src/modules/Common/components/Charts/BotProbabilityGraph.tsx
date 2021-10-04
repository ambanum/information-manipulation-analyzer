import * as Highcharts from 'highcharts';
import * as React from 'react';

import { BotProbabilityGraphProps } from './BotProbabilityGraph.d';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import { paletteColors } from './config';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const BotProbabilityGraph = (props: BotProbabilityGraphProps & HighchartsReact.Props) => {
  const data: Highcharts.Options = {
    title: {
      text: '',
    },
    chart: {
      type: 'column',
    },
    colors: paletteColors,
    xAxis: {
      categories: [...Array(props.data.length)].map((_, index) => `${index}%`),
    },
    yAxis: {
      title: {
        text: 'Nb users',
      },
    },
    series: [
      {
        name: 'Bot probability',
        type: 'column',
        data: props.data,
      },
    ],
  };
  return (
    <>
      <div className="fr-mb-2w">
        <h4 className="fr-mb-1v">Bot probability distribution</h4>
        <p className="fr-mb-0">Lorem ipsum.</p>
      </div>
      <div className="fr-mt-4w">
        <HighchartsReact highcharts={Highcharts} options={data} {...props} />
      </div>
    </>
  );
};

export default React.memo(BotProbabilityGraph);
