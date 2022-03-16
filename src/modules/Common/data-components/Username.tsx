import * as React from 'react';

import Alert from '../components/Alert/Alert';
import BarGraph from '../components/Charts/BarGraph';
import { GetSearchUsernamesResponse } from '../interfaces';
import Loading from 'components/Loading';
import UsernameTable from '../components/Datatables/UsernameTable';
import { UsernameTableProps } from '../components/Datatables/UsernameTable.d';
import useSWR from 'swr';

interface DataUsernameProps {
  search: string;
  refreshInterval: number;
  onUsernameClick: UsernameTableProps['onUsernameClick'];
  onUsernameViewClick: UsernameTableProps['onUsernameViewClick'];
  onUsernameSearchClick: UsernameTableProps['onUsernameSearchClick'];
  onUsernameFilterClick: UsernameTableProps['onUsernameFilterClick'];
  queryParamsStringified?: string;
  exportName: UsernameTableProps['exportName'];
}

const DataUsername = ({
  search,
  refreshInterval,
  onUsernameClick,
  onUsernameViewClick,
  onUsernameSearchClick,
  onUsernameFilterClick,
  queryParamsStringified = '',
  exportName,
}: DataUsernameProps) => {
  const { data, isValidating } = useSWR<GetSearchUsernamesResponse>(
    `/api/searches/${encodeURIComponent(search)}/usernames${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  if (isValidating || !data) {
    return <Loading message="Loading..." />;
  }
  const usernames = data?.usernames || [];
  const nbUsernames = data?.count || 0;
  const nbPerPage = data?.nbPerPage;
  if (nbUsernames === 0) {
    return (
      <Alert size="small" type="info">
        No users found.
      </Alert>
    );
  }

  const botRepartition: any = usernames.reduce(
    (repartition, user) => {
      if (!user || !user.botScore) {
        return repartition;
      }
      const value = Math.round(user.botScore * 100);
      repartition[value]++;
      return repartition;
    },

    [...Array(100)].map(() => 0)
  );

  return (
    <div className="fr-col">
      <UsernameTable
        nbData={nbUsernames}
        nbPerPage={nbPerPage}
        data={usernames}
        onUsernameClick={onUsernameClick}
        onUsernameViewClick={onUsernameViewClick}
        onUsernameSearchClick={onUsernameSearchClick}
        onUsernameFilterClick={onUsernameFilterClick}
        exportName={exportName}
      />
      <div className="fr-mt-8w">
        <BarGraph
          title="Bot probability"
          subtitle="In number of users, views on bar chart"
          yAxisTitle="Nb of users"
          data={botRepartition.map((value: number, index: number) => ({
            x: index,
            y: value,
          }))}
          xAxis={{
            categories: [...Array(botRepartition.length)].map((_, index) => `${index}%`),
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(DataUsername);
