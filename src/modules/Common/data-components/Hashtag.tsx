import * as React from 'react';

import Alert from '../components/Alert/Alert';
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
  onHashtagFilterClick: HashtagTableProps['onHashtagFilterClick'];
  queryParamsStringified?: string;
  exportName: HashtagTableProps['exportName'];
}

const DataHashtag = ({
  search,
  refreshInterval,
  onHashtagClick,
  onHashtagSearchClick,
  onHashtagFilterClick,
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
    return <Loading message="Loading..." />;
  }
  const hashtags = data?.hashtags || [];
  const nbHashtags = data?.count || 0;

  if (nbHashtags === 0) {
    return (
      <Alert type="info" size="small">
        No associated hashtags found.
      </Alert>
    );
  }

  return (
    <div className="fr-col">
      <HashtagTable
        nbData={nbHashtags}
        data={hashtags}
        onHashtagClick={onHashtagClick}
        onHashtagSearchClick={onHashtagSearchClick}
        onHashtagFilterClick={onHashtagFilterClick}
        exportName={exportName}
      />
    </div>
  );
};

export default React.memo(DataHashtag);
