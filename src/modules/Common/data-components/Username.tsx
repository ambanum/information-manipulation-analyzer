import * as React from 'react';

import Alert from '../components/Alert/Alert';
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
    </div>
  );
};

export default React.memo(DataUsername);
