import * as React from 'react';

import Alert from '../components/Alert/Alert';
import BarGraph from '../components/Charts/BarGraph';
import { GetSearchBotRepartitionResponse } from '../interfaces';
import Loading from 'components/Loading';
import useSWR from 'swr';

interface BotRepartitionProps {
  search: string;
  refreshInterval: number;
  queryParamsStringified?: string;
}

const BotRepartition = ({
  search,
  refreshInterval,
  queryParamsStringified = '',
}: BotRepartitionProps) => {
  const { data, isValidating } = useSWR<GetSearchBotRepartitionResponse>(
    `/api/searches/${encodeURIComponent(search)}/botRepartition${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  if (isValidating && !data) {
    return <Loading message="Loading..." />;
  }

  const repartition = data?.repartition || [];
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
      title="Bot probability"
      subtitle="In number of users, views on bar chart"
      yAxisTitle="Nb of users"
      data={repartition.map((value: number, index: number) => ({
        x: index,
        y: value,
      }))}
      xAxis={{
        categories: [...Array(repartition.length)].map((_, index) => `${index}%`),
      }}
    />
  );
};

export default React.memo(BotRepartition);
