import * as React from 'react';

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
    return <Loading />;
  }

  const outlinks = data?.outlinks || [];
  if (outlinks.length === 0) {
    return null;
  }

  return (
    <div className="fr-col">
      <OutlinksTable nbData={outlinks.length} data={outlinks} exportName={exportName} />
    </div>
  );
};

export default React.memo(DataOutlinks);
