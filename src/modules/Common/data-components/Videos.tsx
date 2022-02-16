import * as React from 'react';

import Alert from '../components/Alert/Alert';
import { GetSearchVideosResponse } from '../interfaces';
import Loading from 'components/Loading';
import VideosTable from '../components/Datatables/VideosTable';
import { VideosTableProps } from '../components/Datatables/VideosTable.d';
import useSWR from 'swr';

interface DataVideos {
  search: string;
  queryParamsStringified?: string;
  exportName: VideosTableProps['exportName'];
}

const DataVideos = ({ search, queryParamsStringified = '', exportName }: DataVideos) => {
  const { data } = useSWR<GetSearchVideosResponse>(
    `/api/searches/${encodeURIComponent(search)}/videos${queryParamsStringified}`,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  if (!data) {
    return <Loading message="Loading..." />;
  }

  const videos = data?.videos || [];
  if (videos.length === 0) {
    return (
      <Alert type="info" size="small">
        No videos found.
      </Alert>
    );
  }

  return (
    <div className="fr-col fr-mt-1v">
      <VideosTable nbData={videos.length} data={videos} exportName={exportName} />
    </div>
  );
};

export default React.memo(DataVideos);
