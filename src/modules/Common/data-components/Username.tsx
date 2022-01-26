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
    return <Loading />;
  }
  const usernames = data?.usernames || [];
  if (usernames.length === 0) {
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

  const { max: maxTweetsPerUser } = usernames.reduce(
    (acc, user) => ({ min: Math.min(acc.min, user.value), max: Math.max(acc.max, user.value) }),
    { min: Infinity, max: -1 }
  );

  const nbTweetsPerUserRepartition: any = usernames.reduce(
    (repartition, { value }) => {
      if (value === 1) {
        repartition['1']++;
      } else if (value >= 2 && value <= 5) {
        repartition['2-5']++;
      } else if (value >= 6 && value <= 10) {
        repartition['6-10']++;
      } else if (value >= 11 && value <= 50) {
        repartition['11-50']++;
      } else if (value >= 50 && value <= 200) {
        repartition['50-200']++;
      } else if (value > 200) {
        repartition['200+']++;
      }
      return repartition;
    },
    {
      '1': 0,
      '2-5': 0,
      '6-10': 0,
      '11-50': 0,
      '50-200': 0,
      '200+': 0,
    }
  );

  return (
    <div className="fr-col">
      <UsernameTable
        nbData={usernames.length}
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
      <div className="fr-mt-8w">
        <BarGraph
          title="Tweets per user"
          subtitle="Views on bar chart"
          yAxisTitle="Nb of users"
          xAxis={{
            categories: Object.keys(nbTweetsPerUserRepartition),
          }}
          data={Object.entries(nbTweetsPerUserRepartition).map(
            ([_, y]: [string, unknown], index) => ({
              x: index,
              y: y as number,
            })
          )}
          plotOptions={{
            series: {
              minPointLength: 3,
            },
          }}
        />
      </div>
      {/* <div className="fr-mt-8w">
        <PieChart
          title="Proportion of deleted and suspended account"
          subTitle="Lorem ipssum"
          data={[
            { id: 'active', label: 'Active', value: 80 },
            { id: 'suspened', label: 'Suspended', value: 4 },
            { id: 'deleted', label: 'Deleted', value: 16 },
          ]}
        />
      </div> */}
    </div>
  );
};

export default React.memo(DataUsername);
