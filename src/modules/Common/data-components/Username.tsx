import * as React from 'react';

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
  return (
    <div className="fr-col">
      <UsernameTable
        nbData={usernames.length}
        data={usernames}
        onUsernameClick={onUsernameClick}
        onUsernameSearchClick={onUsernameSearchClick}
        exportName={exportName}
      />
      {/* <div className="fr-mt-8w">
        <BotProbabilityGraph
          data={[
            { y: 300, x: 10 },
            { y: 500, x: 20 },
            { y: 1500, x: 30 },
            { y: 500, x: 40 },
            { y: 3000, x: 50 },
            { y: 10, x: 60 },
            { y: 2500, x: 70 },
            { y: 700, x: 80 },
            { y: 800, x: 90 },
            { y: 300, x: 100 },
          ]}
        />
      </div> */}
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
