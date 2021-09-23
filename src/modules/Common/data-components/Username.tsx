import * as React from 'react';

import BotProbabilityGraph from '../components/Charts/BotProbabilityGraph';
import { GetSearchUsernamesResponse } from '../interfaces';
import Loading from 'components/Loading';
import UsernameTable from '../components/Datatables/UsernameTable';
import { UsernameTableProps } from '../components/Datatables/UsernameTable.d';
import useSWR from 'swr';

interface DataUsernameProps {
  search: string;
  refreshInterval: number;
  onUsernameClick: UsernameTableProps['onUsernameClick'];
  onUsernameSearchClick: UsernameTableProps['onUsernameSearchClick'];
  queryParamsStringified?: string;
  exportName: UsernameTableProps['exportName'];
}

const DataUsername = ({
  search,
  refreshInterval,
  onUsernameClick,
  onUsernameSearchClick,
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
    return null;
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
        nbData={usernames.length}
        data={usernames}
        onUsernameClick={onUsernameClick}
        onUsernameSearchClick={onUsernameSearchClick}
        exportName={exportName}
      />
      <div className="fr-mt-8w">
        <BotProbabilityGraph
          data={botRepartition.map((value: number, index: number) => ({
            x: index,
            y: value,
          }))}
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
