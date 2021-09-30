import * as React from 'react';

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
    return <Loading />;
  }

  const videos = data?.videos || [];
  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="fr-col">
      <VideosTable nbData={videos.length} data={videos} exportName={exportName} />
    </div>
  );
};

export default React.memo(DataVideos);
