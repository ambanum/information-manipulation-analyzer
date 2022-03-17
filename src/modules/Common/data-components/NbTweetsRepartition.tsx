import * as React from 'react';

import Alert from '../components/Alert/Alert';
import BarGraph from '../components/Charts/BarGraph';
import { GetSearchNbTweetsRepartitionResponse } from '../interfaces';
import Loading from 'components/Loading';
import useSWR from 'swr';

interface NbTweetsRepartitionProps {
  search: string;
  refreshInterval: number;
  queryParamsStringified?: string;
}

const NbTweetsRepartition = ({
  search,
  refreshInterval,
  queryParamsStringified = '',
}: NbTweetsRepartitionProps) => {
  const { data, isValidating } = useSWR<GetSearchNbTweetsRepartitionResponse>(
    `/api/searches/${encodeURIComponent(search)}/nbTweetsRepartition${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  if (isValidating || !data) {
    return <Loading message="Loading..." />;
  }
  const repartition = data?.repartition || {};
  const nbUsernames = data?.count || 0;
  if (nbUsernames === 0) {
    return (
      <Alert size="small" type="info">
        No users found.
      </Alert>
    );
  }

  return (
    <BarGraph
      title="Tweets per user"
      subtitle="Views on bar chart"
      yAxisTitle="Nb of users"
      xAxis={{
        categories: Object.keys(repartition),
      }}
      data={Object.entries(repartition).map(([_, y]: [string, unknown], index) => ({
        x: index,
        y: y as number,
      }))}
      plotOptions={{
        series: {
          minPointLength: 3,
        },
      }}
    />
  );
};

export default React.memo(NbTweetsRepartition);
