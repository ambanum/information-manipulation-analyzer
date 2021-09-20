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
      categories: ['0', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
    },
    yAxis: {
      title: {
        text: 'Nb users',
      },
    },
    series: [
      {
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
      <div className="fr-mt-4w" style={{ display: 'flex', justifyContent: 'center' }}>
        <HighchartsReact highcharts={Highcharts} options={data} {...props} />
      </div>
    </>
  );
};

export default React.memo(BotProbabilityGraph);
