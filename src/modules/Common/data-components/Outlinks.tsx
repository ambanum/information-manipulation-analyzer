import * as React from 'react';

import Alert from '../components/Alert/Alert';
import { GetSearchOutlinksResponse } from '../interfaces';
import Loading from 'components/Loading';
import OutlinksTable from '../components/Datatables/OutlinksTable';
import { OutlinksTableProps } from '../components/Datatables/OutlinksTable.d';
import useSWR from 'swr';

interface DataOutlinks {
  search: string;
  queryParamsStringified?: string;
  exportName: OutlinksTableProps['exportName'];
}

const DataOutlinks = ({ search, queryParamsStringified = '', exportName }: DataOutlinks) => {
  const { data } = useSWR<GetSearchOutlinksResponse>(
    `/api/searches/${encodeURIComponent(search)}/outlinks${queryParamsStringified}`,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  if (!data) {
    return <Loading message="Loading..." />;
  }

  const outlinks = data?.outlinks || [];
  if (outlinks.length === 0) {
    return (
      <Alert size="small" type="info">
        No outlinks found.
      </Alert>
    );
  }

  return (
    <div className="fr-col">
      <OutlinksTable nbData={outlinks.length} data={outlinks} exportName={exportName} />
    </div>
  );
};

export default React.memo(DataOutlinks);
