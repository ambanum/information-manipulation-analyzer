import * as React from 'react';

import { GetSearchHashtagsResponse } from '../interfaces';
import HashtagTable from '../components/Datatables/HashtagTable';
import { HashtagTableProps } from '../components/Datatables/HashtagTable.d';
import Loading from 'components/Loading';
import useSWR from 'swr';

interface DataHashtagProps {
  search: string;
  refreshInterval: number;
  onHashtagClick: HashtagTableProps['onHashtagClick'];
  onHashtagSearchClick: HashtagTableProps['onHashtagSearchClick'];
  queryParamsStringified?: string;
  exportName: HashtagTableProps['exportName'];
}

const DataHashtag = ({
  search,
  refreshInterval,
  onHashtagClick,
  onHashtagSearchClick,
  queryParamsStringified = '',
  exportName,
}: DataHashtagProps) => {
  const { data, isValidating } = useSWR<GetSearchHashtagsResponse>(
    `/api/searches/${encodeURIComponent(search)}/hashtags${queryParamsStringified}`,
    {
      refreshInterval,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  if (isValidating || !data) {
    return <Loading />;
  }
  const hashtags = data?.hashtags || [];

  if (hashtags.length === 0) {
    return null;
  }

  return (
    <div>
      <HashtagTable
        nbData={hashtags.length}
        data={hashtags}
        onHashtagClick={onHashtagClick}
        onHashtagSearchClick={onHashtagSearchClick}
        exportName={exportName}
      />
    </div>
  );
};

export default React.memo(DataHashtag);
