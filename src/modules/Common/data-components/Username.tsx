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
    <div>
      <UsernameTable
        nbData={usernames.length}
        data={usernames}
        onUsernameClick={onUsernameClick}
        onUsernameSearchClick={onUsernameSearchClick}
        exportName={exportName}
      />
    </div>
  );
};

export default React.memo(DataUsername);
